import moment from 'moment'

const vFilters = {
    dateFormat(value, formatString = 'YYYY-MM-DD HH:mm') {
        return moment(value).format(formatString)
    }
}

export default vFilters