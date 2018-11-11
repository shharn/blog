import { 
    createLogger, 
    config,
    transports,
    format
} from 'winston';
import { IS_DEVELOPMENT } from './constant';

const { combine, timestamp, json} = format;

const myTransports = [
    new transports.File({
        dirname: 'log',
        filename: `${new Date().toLocaleString('ko-kr', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).replace(/\. /g, '-')}.log`
    })
];

if (IS_DEVELOPMENT) {
    myTransports.push(new transports.Console())
}

const logger = createLogger({
    levels: IS_DEVELOPMENT ? config.syslog.debug : config.syslog.warning,
    transports: myTransports,
    format: combine(
        timestamp(),
        json()
    )
});

export default logger;