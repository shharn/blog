// @flow
export type Provider = (state: mixed) => mixed

type ProviderTemplateConfigs = {
    dataProvider: Provider,
    statusProvider: Provider,
    errorProvider: Provider,
    reduxPropsProvider?: Provider
};

export const reduxProviderTemplate = ({ 
    dataProvider, 
    statusProvider, 
    errorProvider, 
    reduxPropsProvider 
}: ProviderTemplateConfigs) => (state: mixed) => {
    return {
        data: {
            status: statusProvider(state),
            error: errorProvider(state),
            relayed: dataProvider(state),
        },
        reduxProps: reduxPropsProvider ? reduxPropsProvider(state) : {}
    };
};

export const dispatchProviderTemplate = (loader: any) => (dispatch: any) => ({ 
    loader: (offset: number, count: number, ...args?: Array<mixed>) => dispatch(loader(offset, count, args))
 });