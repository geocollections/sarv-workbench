/* DOCS: https://www.npmjs.com/package/@fortawesome/vue-fontawesome
 *
 * EXAMPLE - Importing same icon from different styles:
 * import { faFilePdf as fasFilePdf } from '@fortawesome/free-solid-svg-icons'
 * import { faFilePdf as farFilePdf } from '@fortawesome/free-regular-svg-icons'
 * library.add(fasCoffee, farCoffee)
 *
 * EXAMPLE - Syntax for using different styles:
 * <font-awesome-icon :icon="['far', 'file-pdf']" />
 * <font-awesome-icon :icon="['fas', 'file-pdf']" />
 * This uses solid icon -->  <font-awesome-icon icon="file-pdf" />
 *
 * DOCS: https://www.npmjs.com/package/@fortawesome/vue-fontawesome
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faThumbtack,faProjectDiagram,faTag,faGlobeAmericas,faFileVideo,faFileAudio,faDownload,faVial,faVideo,faMicrophone,faCameraRetro,faChevronDown,faChevronUp,faGlobe,faFile,faFileExcel,faFileImage,faEye,faFolderOpen,faUserFriends,faFileContract,faInfo,faPenFancy,faTimes,faExternalLinkAlt, faUserLock, faLock, faCalendarAlt, faCommentAlt, faLink, faPencilAlt, faTrashAlt, faBook, faUndo, faFilePdf, faFileExport, faAsterisk, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import {
  faFilePdf as farFilePdf, faFileExcel as farFileExcel,
  faCopy as farCopy, faFile as farFile,
  faPlusSquare as farPlusSquare} from '@fortawesome/free-regular-svg-icons'

library.add(
  faThumbtack,faProjectDiagram,faTag,faGlobeAmericas,faFileVideo,faFileAudio,faDownload,faVial,faVideo,faMicrophone,faCameraRetro,faChevronDown,faChevronUp,faGlobe,faFile,faFileExcel,faFileImage,faEye,faFolderOpen,faUserFriends,faFileContract,faInfo,faPenFancy,faTimes, faUserLock, faLock, faCalendarAlt, faExternalLinkAlt,faCommentAlt,faLink,faPencilAlt,faTrashAlt, faBook, faUndo, faFilePdf, faFileExport, faAsterisk, faCheck, faExclamationTriangle,
  farFilePdf, farFileExcel, farCopy, farFile, farPlusSquare
)

const fontAwesomeLib = {
  components: {
    FontAwesomeIcon
  },
};

export default fontAwesomeLib
