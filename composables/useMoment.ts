import moment from 'moment'
import 'moment/dist/locale/pt-br'

export default () => {
  moment.locale('pt-br')
  return moment
}