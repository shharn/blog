export const reduxProviderTemplate = ({ dataProvider, statusProvider, errorProvider }) => (state, ownProps) => {
    return {
        ...ownProps,
        data: {
            status: statusProvider(state),
            error: errorProvider(state),
            relayed: dataProvider(state)
        }
    };
};

export const dispatchProviderTemplate = loader => dispatch => ({ 
    loader: (offset, count, ...args) => dispatch(loader(offset, count, args))
 });