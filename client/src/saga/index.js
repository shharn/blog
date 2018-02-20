import authSaga from './auth';
import { fork } from 'redux-saga/effects';

export default function* root() {
    yield fork(authSaga);
}   