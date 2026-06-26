import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

const SUBSIDY_PROCEDURE_STEP_TYPE = {
  EXTERNALLY_PROCESSED:
    'http://lblod.data.gift/concepts/3ded9eab-ff5b-4a20-a095-0825de486f42',
};

export default class SubsidyProceduralStepModel extends Model {
  @service currentSession;

  @attr description;
  @attr('uri-set') type;

  @belongsTo('period-of-time', {
    async: true,
    inverse: null,
  })
  period;

  @hasMany('deadline-extension', {
    async: true,
    inverse: 'subsidyProceduralStep',
  })
  deadlineExtensions;

  get isExternallyProcessed() {
    return (
      this.type &&
      this.type.includes(SUBSIDY_PROCEDURE_STEP_TYPE.EXTERNALLY_PROCESSED)
    );
  }

  // The deadline-extension (if any) that applies to the current organization.
  // When the current org is in an extension's audience, the most recent one
  // (by `created`) takes precedence over the base period end.
  get applicableDeadlineExtension() {
    const extensions = this.hasMany('deadlineExtensions').value();
    const currentOrgId = this.currentSession.group?.id;
    if (!extensions?.length || !currentOrgId) return null;

    const applicable = extensions.filter((ext) =>
      ext
        .hasMany('audience')
        .value()
        ?.some((org) => org.id === currentOrgId),
    );
    return applicable.slice().sort((a, b) => b.created - a.created)[0] ?? null;
  }

  // The effective submission deadline: the applicable extension's `valid` date
  // when present, otherwise the base period end.
  get effectiveDeadline() {
    const extension = this.applicableDeadlineExtension;
    return extension?.valid ?? this.belongsTo('period').value()?.end;
  }
}
