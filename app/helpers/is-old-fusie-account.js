export default function isOldFusieAccount(groupId) {
  const group = `http://data.lblod.info/id/bestuurseenheden/` + groupId;

  const oldFusieAccountIds = [
    // Beveren-Kruibeke-Zwijndrecht
    'http://data.lblod.info/id/bestuurseenheden/4f0eb4436c88cf831c35f84e7c34ce32f9ee4e99c5139aff62990e5e531aa1e7', // Beveren - gemeente
    'http://data.lblod.info/id/bestuurseenheden/72bc672ceb6894d8dd31dc2dff2faad2fd93f4b9f5347d556d092516eaa30aa3', // Beveren - ocmw
    'http://data.lblod.info/id/bestuurseenheden/6af55cecaea3621f53bb32417a36ed6e3d41b2aa5b9f6d62ab3d80cc8ec11539', // Kruibeke - gemeente
    'http://data.lblod.info/id/bestuurseenheden/d3c76fd84794dad5e12c9eed6d6332dc5e5c99daf0e4ddd7ceebf13d5d6c0ccd', // Kruibeke - ocmw
    'http://data.lblod.info/id/bestuurseenheden/c362abc58ac4579ff417824ce620962ac57bc344b34fe8f51d21b35ef54da36d', // Zwijndrecht - gemeente
    'http://data.lblod.info/id/bestuurseenheden/bbc23313f4c8585a0c51f15f920d77123356535cd1cad9af38f5707892c7088d', // Zwijndrecht - ocmw

    // Bilzen-Hoeselt
    'http://data.lblod.info/id/bestuurseenheden/a3bd0845853278f478f90b14436d3efa99e73249a84d462f0ddc2e5b6e37a156', // Hoeselt - gemeente
    'http://data.lblod.info/id/bestuurseenheden/785e8d5516378c7382ad0e7e356d2301496d810c6cd46d72ccebb455d3ac525e', // Hoeselt - ocmw

    // Tongeren-Borgloon
    'http://data.lblod.info/id/bestuurseenheden/05441122597e0b20b61a8968ea1247c07f9014aad1f1f0709d0b1234e3dfbc2f', // Borgloon - gemeente
    'http://data.lblod.info/id/bestuurseenheden/3834647b5e95ea20f5ffe5a12a09fbd3d7fdf0d187fab385cb7b841422176ad6', // Borgloon - ocmw

    // Nazareth-De Pinte
    'http://data.lblod.info/id/bestuurseenheden/0327a51548f73607f8a5ec11b36711a3c96703686ad93a3d632718c135c295db', // Nazareth - gemeente
    'http://data.lblod.info/id/bestuurseenheden/0a2d980559eb9f3e0820386541274a72692f495204cd6d951ea1907ecc65829b', // Nazareth - ocmw
    'http://data.lblod.info/id/bestuurseenheden/e39bc997aa6dd9f240277735efd745b6a0422614d2b36cf01825c86b1b91a9ee', // De Pinte - gemeente
    'http://data.lblod.info/id/bestuurseenheden/144c75e403c5084af57f5c0c86252b8759b56baf9694326abbcb5ea40ab69f1a', // De Pinte - ocmw

    // Pajottegem
    'http://data.lblod.info/id/bestuurseenheden/00eb231f51bd6b4f5dcc6536b2d09a174ea8583f5bf28b10bc4fc769a07e511d', // Galmaarden - gemeente
    'http://data.lblod.info/id/bestuurseenheden/ba8a253d98ea7d2ab1afc43e5e2cd145a12ccd86b68e71d023e3c13a83d7498f', // Galmaarden - ocmw
    'http://data.lblod.info/id/bestuurseenheden/c69192b973a3ca11531b9657b3ee20aa6688fa33ea1ef1392310fec751980ab2', // Gooik - gemeente
    'http://data.lblod.info/id/bestuurseenheden/76c45d60f05bf8afc8c71859342b69cac6a57ee2b320b900a60afd6ba9b8eb9d', // Gooik - ocmw
    'http://data.lblod.info/id/bestuurseenheden/3eb8c9fae32d02359dcd7b22e2a74e67a5b48388df31ad819c27c688fedd10b0', // Herne - gemeente
    'http://data.lblod.info/id/bestuurseenheden/5d21ccef2f5aa3ccbf3a74c6f25ebe9f0b1ef5a97b87f3d79c86ae9d6d857df8', // Herne - ocmw

    // Tessenderlo-Ham
    'http://data.lblod.info/id/bestuurseenheden/af8969752f6b28c66b6bc402d7987fa38774901ac72b95c5cb7976570487c3c9', // Tessenderlo - gemeente
    'http://data.lblod.info/id/bestuurseenheden/fb1be873c4b31e391613dfae8e68edd694b1fdf126eeecb502b1e5cad6f2f682', // Tessenderlo - ocmw

    // Hasselt
    'http://data.lblod.info/id/bestuurseenheden/f6b131de5e40a0dfd4fc93fedf3b95c9bf156ece718b87fe00469dea2564b3fb', // Kortessem - gemeente
    'http://data.lblod.info/id/bestuurseenheden/3e077115eeb70b649d44e2ebbb218f2cfcac5d84e130c88584f0ec23f7cebbf9', // Kortessem - ocmw

    // Lochistri
    'http://data.lblod.info/id/bestuurseenheden/1313d4a58f9ecf52cc7e274e3549a759b35e731973cc9f5e07562e5650f594dd', // Wachtebeke - gemeente
    'http://data.lblod.info/id/bestuurseenheden/7c6b38fa6fc65879cb674a654617de171adfcfacba086fb918da3749dbaa43b5', // Wachtebeke - ocmw

    // Lokeren
    'http://data.lblod.info/id/bestuurseenheden/c5dbb08e35e2d090a05d119fef4cc161b5ee1f322698cb8ea3c8c6643a521cf2', // Moerbeke - gemeente
    'http://data.lblod.info/id/bestuurseenheden/f2a9a2392d5e4c0f992a84a0871d048a7b91b14681e9980a63aa6ba4b1f7eb8c', // Moerbeke - ocmw

    // Merelbeke-Melle
    'http://data.lblod.info/id/bestuurseenheden/c0b6b5cf198cd939251dff8ed052177cfff245074c6b8d43394c8c97f7b6e945', // Melle - gemeente
    'http://data.lblod.info/id/bestuurseenheden/04895013fe6301f32aa46deae98abfb833a717ece5a33b6c453674c6d0f4cc5e', // Melle - ocmw
    'http://data.lblod.info/id/bestuurseenheden/8ef1e4a43efd913e6b09b0ddea344b7b5d723a344ad559389a55ae1ff0bebc8f', // Merelbeke - gemeente
    'http://data.lblod.info/id/bestuurseenheden/f56f068943a99059f5bfc3b905fe8848a25a47cfa30fb3ed3d294b47815b2255', // Merelbeke - ocmw

    // Tielt
    'http://data.lblod.info/id/bestuurseenheden/5a4b2b4f1de1f3b91b0348a7eb6d6aa0ef9420b8ec31374970c9ffe933a79515', // Meulebeke - gemeente
    'http://data.lblod.info/id/bestuurseenheden/3f57a17fbcdfc13def910c54948bec11d71d3f75946b0336fffc0587bf18d783', // Meulebeke - ocmw

    // Wingene
    'http://data.lblod.info/id/bestuurseenheden/2564e21e3650f91625189ccb7eb055e47754a0633c54c7582a899171fef60c52', // Ruiselede - gemeente
    'http://data.lblod.info/id/bestuurseenheden/60daf27c2cf12dd123447aa300dd7320890391dbd8dd6b4dd7ec02258f8281b3', // Ruiselede - ocmw

    // Antwerpen
    'http://data.lblod.info/id/bestuurseenheden/e41ffa04f94bb450a79793020e70d55b5fee5033a5280277998608a9d0913117', // Borsbeek - gemeente
    'http://data.lblod.info/id/bestuurseenheden/7125fcbfb7a08f8c01efbed115cea602db249c04afe9b5a2cc298cc7949cd040', // Borsbeek - ocmw
  ];

  return oldFusieAccountIds.includes(group);
}
