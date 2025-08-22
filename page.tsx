import React from 'react'

const page = () => {
  return (
    <section className="mx-auto max-w-5xl py-10 px-8 space-y-6 border-x" >
    <h2 >La barre de recherche Content Server</h2>
    <div className="border h-64 w-full ">
        <img src="/image.png" alt="screenshot" />
    </div>
   <div className="space-y-6" >
   <p>La barre de recherche Content Server apparaît, par défaut, sur la plupart des pages à l'extrême droite de la barre de menu générale. Observez les éléments suivants de gauche à droite de la barre de recherche :</p>

   <ul className="list-disc pl-5">
    <li>Le texte Rechercher,</li>
    <li>La zone de saisie « Rechercher à partir d'ici »,</li>
    <li>Le bouton « Exécuter la recherche »,</li>
    <li>Et la flèche vers le bas « Ouvrir le panneau de recherche » qui permet de développer la barre de recherche en panneau de recherche. Si vous développez le panneau de recherche, la flèche vers le bas devient une flèche vers le haut appelée « Fermer le panneau de recherche ».</li>

   </ul>
   </div>
   <div className="space-y-6">
    <h3>1. Pour effectuer une recherche en utilisant la barre de recherche Content Server :</h3>
    <ol className="list-decimal pl-10" >
        <li>Définissez vos critères de recherche en saisissant votre requête dans le champ Rechercher de la barre du menu global. </li>
        <li>Cliquez sur le bouton Exécuter la recherche.</li>
    </ol>
   </div>
  
    <h3 className="mb-4">2. Pour effectuer une recherche en utilisant la barre de recherche Content Server :</h3>
    <p className="mb-2">L’administrateur peut paramétrer des formulaires de recherche en fonction des besoin métier. On peut créer des formulaire de recherche à base des clés clés uniques (N° offre, n° d’affaire, n° tiers) ou à base d’un type de dossier, type de document, famille de crédit; etc.</p>
  
   <p>Tous les utilisateurs ont la possibilité de lancer une recherche depuis leurs espaces.</p>
   <div className="border h-64 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <p className="mb-4">Pour lancer une recherche à base des formulaires il suffit de choisir autres formulaires dans la liste déroulante qui s’affiche après avoir cliquer dans la barre de recherche sur l’espace utilisateur. Une liste des formulaires déjà paramétrés s’affiche.</p>
    <div className="border h-64 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <div>
        <h4>a. Recherche par numéro d’affaire</h4>
    </div>
    <div className="grid grid-cols-3 gap-4 items-center">
        
        <div className="border h-96 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <ol className="list-decimal col-span-2 pl-5">
        <li>Choisir un formulaire et cliquer dessus, exemple «recherche par numéro d’affaire»</li>
        <li>Taper un numéro d’affaire puis cliquer sur le bouton «Rechercher» </li>
        <li>Le système retourne le dossier du numéro d’affaire trouvé dans la base GED</li>
    </ol>
   

    </div>
    <div className="border h-64 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <div className="border-l-4 text-sm p-4 mt-4">
<h5 className="font-bold mb-1">Remarque</h5>
<ul className="list-disc pl-5">
 <li>L’utilisateur peut consulter tout le contenu du dossier trouvé en navigant dans les sous dossiers qui le composent.</li>

  
  <li>Un message de notification est retourné à l’utilisateur si le numéro d’affaire saisi est incorrecte. </li>
  </ul>

</div>
<div>
        <h4>b. Recherche par numéro tiers </h4>
    </div>
    <div>
        <p>Une autre recherche peut être faite en utilisant un autre formulaire «Recherche par numéro tiers» (Tiers client, tiers payeur ou tiers caution).</p>
    </div>
    <div className="grid grid-cols-3 gap-4 items-center">
        
        
        <div className="border h-96 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <ol className="list-decimal col-span-2 pl-5">
        <li>Saisir un des trois numéros puis lancer la recherche.</li>
        <li>Le résultat de la recherche est retourné dans une autre page:</li>

    </ol>
   

    </div>
    <div className="border h-64 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <div className="mb-4 ">
        <h4>c. Recherche rapport reclamation</h4>
    </div>
    <div className="mb-4">
        <p>Ce formulaire permet spécialement de rechercher dans la base GED tous les rapports des réclamations déjà classés</p>
    </div>
    <div className="grid grid-cols-3 gap-4 items-center">
        
        
        <div className="border h-96 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <ol className="list-decimal col-span-2 pl-5">
        <li>Choisir dans la liste des formulaires «Recherche rapport réclamation», spécifier l’année de recherche puis lancer la recherche. Vous pouvez ajouter d’autre paramètres si vous voulez plus de précision.</li>
        <li>Le résultat de la recherche est retourné dans une autre page:</li>

    </ol>
   

    </div>
    <div className="border h-64 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <div className="space-4 mb-4">
        <h4>d. Recherche réclamation par numéro de ticket </h4>
        <p>Un autre exemple de formulaire permet de rechercher une réclamation par numéro de ticket. </p>
    </div>
    <div className="grid grid-cols-3 gap-4 items-center">
        
        
        <div className="border h-96 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <ol className="list-decimal col-span-2 pl-5">
        <li>Choisir dans la liste «Recherche réclamation» puis saisir un numéro de ticket. </li>
        <li>Le système retourne le bon dossier si le numéro du ticket est correcte</li>

    </ol>
   

    </div>
    <div className="border h-72 w-full mb-4 ">
        <img src="/image.png" alt="screenshot" />
    </div>
    <div className="border-l-4 text-sm p-4 mt-4">
<h5 className="font-bold mb-1">Remarque</h5>
<p>
Les autres formulaire fonctionnent de la même façon et permet à l’utilisateur de faciliter et spécifier la recherche aux utilisateurs.
</p>
</div>



   

  
    
    




</section>
  )
}

export default page