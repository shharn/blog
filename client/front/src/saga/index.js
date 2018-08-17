import authSaga from './auth';
import dataSaga from './data';
import { fork } from 'redux-saga/effects';

export default function* root() {
    yield fork(authSaga);
    yield fork(dataSaga);
}   