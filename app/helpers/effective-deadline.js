import { helper } from '@ember/component/helper';

export function getEffectiveDeadline([consumption, flowStep]) {
  // Get the procedural step priod
  const proceduralStep = flowStep?.belongsTo('subsidyProceduralStep').value();
  const periodEnd = proceduralStep?.belongsTo('period').value()?.end;

  // Get the procedural step deadline extensions
  const extensions =
    proceduralStep?.hasMany('deadlineExtensions').value() ?? [];

  // Get the consumption participation
  const participation = consumption?.hasMany('participations').value()?.[0];
  const organization = participation
    ?.belongsTo('participatingOrganization')
    .value();
  const organizationId = organization?.id;

  if (!extensions.length || !organizationId) return periodEnd;

  // Get the applicable deadline extension
  const applicable = extensions.filter((extension) =>
    extension
      .hasMany('audience')
      .value()
      ?.some(
        (audienceOrganization) => audienceOrganization.id === organizationId,
      ),
  );
  const extension = applicable.slice().sort((a, b) => b.created - a.created)[0];

  return extension?.valid ?? periodEnd;
}

export default helper(getEffectiveDeadline);
