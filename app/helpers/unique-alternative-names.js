export default function hasUniqueAlternativeNames(account) {
  const orgName = account.gebruiker.achternaam;
  const allUniqueAltNames = [];

  account.gebruiker.organizations.forEach((organisatie) => {
    const alternativeNames = organisatie.alternatieveNaam || [];
    const uniqueAltNames = alternativeNames.filter(
      (altName) => altName !== orgName,
    );
    allUniqueAltNames.push(...uniqueAltNames);
  });

  return allUniqueAltNames;
}
