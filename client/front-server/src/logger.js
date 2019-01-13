import { 
    createLogger, 
    config,
    transports,
    format
} from 'winston';
import moment from 'moment-timezone';
import { IS_DEVELOPMENT } from './constant';

const TIMEZONE = process.env.TZ || 'Asia/Seoul';
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const timestamp = format((info, _) => {
    info.timestamp = moment().tz(TIMEZONE).format(TIMESTAMP_FORMAT);
    return info;
});
const { combine, json} = format;

const logger = createLogger({
    levels: config.syslog.levels,
    transports: [ new transports.Console({
        level: IS_DEVELOPMENT ? 'debug' : 'info'
    }) ],
    format: combine(
        timestamp(),
        json()
    )
});

export default logger;