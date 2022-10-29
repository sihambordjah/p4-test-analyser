/**
* @license Copyright 2017 Les auteurs du phare. Tous les droits sont réservés.
* Sous licence Apache, version 2.0 (la "Licence"); vous ne pouvez pas utiliser ce fichier sauf en conformité avec la licence. Vous pouvez obtenir une copie de la licence à l'adresse http://www.apache.org/licenses/LICENSE-2.0
* Sauf si requis par la loi applicable ou convenu par écrit, le logiciel distribué sous la Licence est distribué sur une BASE "TEL QUEL", SANS GARANTIE OU CONDITION D'AUCUNE SORTE, expresse ou implicite. Consultez la Licence pour connaître la langue spécifique régissant les autorisations et les limitations dans le cadre de la Licence.
*/

import  { ByteEfficiencyAudit }  de  './byte-efficiency-audit.js' ;
import  { UnusedCSS }  de  '../../computed/unused-css.js' ;
importer  *  en tant que  i18n  depuis  '../../lib/i18n/i18n.js' ;

const  UISstrings  =  {
  /** Titre impératif d'un audit Lighthouse qui indique à l'utilisateur de réduire le contenu de son CSS qui n'est pas nécessaire immédiatement et de charger ce contenu ultérieurement. Cela s'affiche dans une liste de titres d'audit générés par Lighthouse. */
  title : 'Réduire les CSS inutilisés' ,
  /** Description d'un audit Lighthouse qui indique à l'utilisateur *pourquoi* il doit différer le chargement de tout contenu en CSS qui n'est pas nécessaire au chargement de la page. Cela s'affiche après qu'un utilisateur développe la section pour en voir plus. Aucune limite de longueur de mot. La dernière phrase commençant par "Apprendre" devient le texte du lien vers une documentation supplémentaire. */
  description : 'Réduit les règles inutilisées des feuilles de style et reporte les CSS non utilisés pour '  +
    'contenu au-dessus du pli pour diminuer les octets consommés par l'activité du réseau. '  +
    '[Apprenez à réduire les CSS inutilisés](https://web.dev/unused-css-rules/).' ,
} ;

const  str_  =  i18n . createIcuMessageFn ( import . meta . url ,  UISstrings ) ;

// Autoriser 10 Ko de CSS inutilisé pour autoriser `: hover` et d'autres styles non utilisés sur un chargement non interactif.
// @voir https://github.com/GoogleChrome/lighthouse/issues/9353 pour plus de discussion.
const  IGNORE_THRESHOLD_IN_BYTES  =  10  *  1024 ;

classe  UnusedCSSRules  étend  ByteEfficiencyAudit  {
  /**
   * @return { LH.Audit.Meta }
   */
  statique  obtenir  méta ( )  {
    retour  {
      id : 'unused-css-rules' ,
      titre : str_ ( UISstrings . titre ) ,
      description : str_ ( UISstrings . description ) ,
      scoreDisplayMode : ByteEfficiencyAudit . SCORING_MODES . NUMÉRIQUE ,
      requisArtifacts : [ 'CSSUsage' ,  'URL' ,  'devtoolsLogs' ,  'traces' ,  'GatherContext' ] ,
    } ;
  }

  /**
   * @param { LH.Artifacts } artefacts
   * @param { LH.Artifacts.NetworkRequest[] } _
   * @param { LH.Audit.Context } contexte
   * @return { Promesse<import('./byte-efficiency-audit.js').ByteEfficiencyProduct> }
   */
  static  async  audit_ ( artefacts ,  _ ,  contexte )  {
    const  unusedCssItems  =  attendre  UnusedCSS . demande ( {
      CSSUsage : artefacts . CSSUsage ,
      devtoolsLog : artefacts . devtoolsLogs [ ByteEfficiencyAudit . DEFAULT_PASS ] ,
    } ,  contexte ) ;
     éléments  const =  élémentsCssinutilisés
      . filter ( feuille  =>  feuille  &&  feuille . wastedBytes  >  IGNORE_THRESHOLD_IN_BYTES ) ;

    /** @type {LH.Audit.Details.Opportunity['rubriques']} */
    const en -  têtes  =  [
      { clé : 'url' ,  valueType : 'url' ,  étiquette : str_ ( i18n . UIStrings . columnURL ) } ,
      { clé : 'totalBytes' ,  valueType : 'bytes' ,  étiquette : str_ ( i18n . UIStrings . columnTransferSize ) } ,
      { clé : 'wastedBytes' ,  valueType : 'bytes' ,  étiquette : str_ ( i18n . UIStrings . columnWastedBytes ) } ,
    ] ;

    retour  {
      articles ,
      rubriques ,
    } ;
  }
}

exporter les  règles UnusedCSSRules par défaut  ;
exporter  { UISstrings } ;