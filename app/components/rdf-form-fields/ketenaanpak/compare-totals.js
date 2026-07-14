import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { literal, Literal, Namespace } from 'rdflib';
import { LBLOD_SUBSIDIE, XSD } from 'frontend-subsidiepunt/rdf/namespaces';

const EXT = new Namespace('http://mu.semte.ch/vocabularies/ext/');

const spendingAmountPredicate = LBLOD_SUBSIDIE(
  'subsidieBedragListingUnitBedrag',
);
const requestedAmountPredicate = LBLOD_SUBSIDIE('subsidieBedragAanvraag');
const validCompareTotalsPredicate = LBLOD_SUBSIDIE(
  'validKetenaanpakCompareTotals',
);

export default class RdfFormFieldsKetenaanpakCompareTotals extends Component {
  @tracked totals = new Totals();
  @tracked errors = [];

  id = guidFor(this);

  constructor() {
    super(...arguments);

    this.calculateTotals();

    this.args.formStore.registerObserver(() => {
      this.calculateTotals();
    }, this.id);
  }

  get hasErrors() {
    return this.errors.length > 0;
  }

  get errorMessage() {
    if (this.errors.length > 0) {
      return this.errors[0].message;
    }

    return null;
  }

  formatAmount = (amount) => {
    return new Intl.NumberFormat('nl-BE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  calculateTotals() {
    const { formStore, graphs, sourceNode } = this.args;
    const errors = [];

    const spendingAmountLiterals = formStore.match(
      undefined,
      spendingAmountPredicate,
      undefined,
      graphs.sourceGraph,
    );
    const requestedAmountLiteral = formStore.any(
      sourceNode,
      requestedAmountPredicate,
      undefined,
      graphs.sourceGraph,
    );

    const spendingAmountCents = spendingAmountLiterals.reduce(
      (total, triple) => {
        const amount = this.literalToCents(triple.object);

        if (amount === null) {
          errors.pushObject({
            message:
              'Een van de besteding subsidiebedragen is geen geldig bedrag.',
          });
          return total;
        }

        return total + amount;
      },
      0,
    );
    const requestedAmountCents = this.literalToCents(requestedAmountLiteral);

    if (requestedAmountCents === null) {
      errors.pushObject({
        message: 'Het subsidiebedrag aanvraag is geen geldig bedrag.',
      });
    }

    const totals = new Totals({
      requestedAmountCents: requestedAmountCents || 0,
      spendingAmountCents,
    });

    if (errors.length === 0 && totals.differenceCents !== 0) {
      errors.pushObject({
        message: this.differenceMessage(totals.differenceCents),
      });
    }

    this.totals = totals;
    this.errors = errors;
    this.updateValidity(errors.length === 0);
  }

  literalToCents(literalValue) {
    if (!literalValue) {
      return 0;
    }

    const amount = Literal.toJS(literalValue);
    let parsedAmount;

    if (typeof amount === 'number') {
      parsedAmount = amount;
    } else if (typeof amount === 'string' && amount.trim().length > 0) {
      parsedAmount = Number(amount);
    }

    if (!Number.isFinite(parsedAmount)) {
      return null;
    }

    return Math.round(parsedAmount * 100);
  }

  differenceMessage(differenceCents) {
    if (differenceCents > 0) {
      return `Er werd ${this.formatAmount(
        centsToAmount(differenceCents),
      )} te veel toegewezen.`;
    }

    return `Er werd ${this.formatAmount(
      centsToAmount(Math.abs(differenceCents)),
    )} te weinig toegewezen.`;
  }

  updateValidity(isValid) {
    const { formStore, graphs, sourceNode } = this.args;
    const triples = formStore.match(
      sourceNode,
      validCompareTotalsPredicate,
      undefined,
      graphs.sourceGraph,
    );

    formStore.removeStatements([...triples]);

    if (isValid) {
      formStore.addAll([
        {
          subject: sourceNode,
          predicate: validCompareTotalsPredicate,
          object: literal(true, XSD('boolean')),
          graph: graphs.sourceGraph,
        },
      ]);
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.formStore.deregisterObserver(this.id);
  }
}

class Totals {
  requestedAmountCents = 0;
  spendingAmountCents = 0;

  constructor({ requestedAmountCents = 0, spendingAmountCents = 0 } = {}) {
    this.requestedAmountCents = requestedAmountCents;
    this.spendingAmountCents = spendingAmountCents;
  }

  get requestedAmount() {
    return centsToAmount(this.requestedAmountCents);
  }

  get spendingAmount() {
    return centsToAmount(this.spendingAmountCents);
  }

  get differenceCents() {
    return this.spendingAmountCents - this.requestedAmountCents;
  }

  get difference() {
    return centsToAmount(this.differenceCents);
  }
}

function centsToAmount(cents) {
  return cents / 100;
}
