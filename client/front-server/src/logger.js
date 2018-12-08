import { 
    createLogger, 
    config,
    transports,
    format
} from 'winston';
import moment from 'moment-timezone';
import { IS_DEVELOPMENT } from './constant';

const TIMEZONE = process.env.TZ;
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const timestamp = format((info, _) => {
    info.timestamp = moment().tz(TIMEZONE).format(TIMESTAMP_FORMAT);
    return info;
});
const { combine, json} = format;

const logger = createLogger({
    levels: IS_DEVELOPMENT ? config.syslog.debug : config.syslog.info,
    transports: [ new transports.Console() ],
    format: combine(
        timestamp(),
        json()
    )
});

export default logger;