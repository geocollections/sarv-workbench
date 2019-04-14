import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faThumbtack,faProjectDiagram,faTag,faGlobeAmericas,faFileVideo,faFileAudio,faDownload,faVial,faVideo,faMicrophone,faCameraRetro,faChevronDown,faChevronUp,faGlobe,faFile,faFileExcel,faFileImage,faEye,faFolderOpen,faUserFriends,faFileContract,faInfo,faPenFancy,faTimes,faExternalLinkAlt, faUserLock, faLock, faCalendarAlt, faCommentAlt, faLink, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons'

library.add(faThumbtack,faProjectDiagram,faTag,faGlobeAmericas,faFileVideo,faFileAudio,faDownload,faVial,faVideo,faMicrophone,faCameraRetro,faChevronDown,faChevronUp,faGlobe,faFile,faFileExcel,faFileImage,faEye,faFolderOpen,faUserFriends,faFileContract,faInfo,faPenFancy,faTimes, faUserLock, faLock, faCalendarAlt, faExternalLinkAlt,faCommentAlt,faLink,faPencilAlt,faTrashAlt)

const fontAwesomeLib = {
  components: {
    FontAwesomeIcon
  },
};

export default fontAwesomeLib
