export const reduxProviderTemplate = ({ dataProvider, statusProvider, errorProvider, reduxPropsProvider }) => (state, ownProps) => {
    const reduxProps = typeof reduxPropsProvider === 'function' && reduxPropsProvider(state, ownProps);
    return {
        ...ownProps,
        data: {
            status: statusProvider(state),
            error: errorProvider(state),
            relayed: dataProvider(state),
        },
        reduxProps
    };
};

export const dispatchProviderTemplate = loader => dispatch => ({ 
    loader: (offset, count, ...args) => dispatch(loader(offset, count, args))
 });