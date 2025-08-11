import React, { createContext, useContext, useMemo } from 'react';
import { NuggetSDK } from 'nugget-sdk';
import type { NuggetAuthProvider, NuggetAuthUserInfo, NuggetChatBusinessContext, NuggetJumborConfiguration , AccentColorData , FontData } from 'nugget-sdk';

// Define the context shape
interface NuggetSDKContextType {
    sdk: NuggetSDK;
    isInitialized: boolean;
}

// Create the context
const NuggetSDKContext = createContext<NuggetSDKContextType | null>(null);
// const defaultToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBWZXJzaW9uIjoiIiwiYnVzaW5lc3NJZCI6MSwiY2xpZW50SWQiOjksImNsaWVudF9uYW1lIjoiaG91c2luZyIsImRpc3BsYXlOYW1lIjoiSGVsbG8iLCJlbWFpbCI6InRlc3RAaG91c2luZy5jb20iLCJleHAiOjE3NTQ3MTgyMDksImhvc3ROYW1lIjoiaG91c2luZy5udWdnZXQuY29tIiwiaWF0IjoxNzU0NjMxODA5LCJsYW5ndWFnZSI6IiIsInBob25lTnVtYmVyIjoiIiwicGhvdG9VUkwiOiIiLCJzb3VyY2UiOiJpb3MiLCJ0ZW5hbnRJRCI6MzAsInVpZCI6ImExNjk0ZmZjLWVhZDktNGE3My04MGI2LTZmYmY5N2E5NGIyOCJ9.1M_Nr9lMkdvB7BD8X9Bf0YubNs2vI2yWtMjjbW6GD9k'
// Auth Provider Implementation
class NuggetAuthProviderImpl implements NuggetAuthProvider {
    private accessToken: string = '';

    constructor(initialToken: string = '') {
        this.accessToken = initialToken;
        console.log('This.accesstoken ' + this.accessToken);
    }

    async getAuthInfo(): Promise<NuggetAuthUserInfo> {
      // call your access token API here, set this.accessToken = received token anf return token as well as http code
      console.log('Returning access token from getAuthInfo: ' + this.accessToken);

    try {

      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      return {
        accessToken: 'put-token-here',
        httpCode: 200,
      };
      // const accessToken = responseData?.data?.accessToken?.token || ''
      // if (accessToken == null) return emptyInfo
      // console.log('Returning access token from getAuthInfo: 5')

      // const result = { accessToken, httpCode }
      // return result
    } catch (error) {
      console.log(`[${new Date().toISOString()}] Pooja: error`, error);
      return { accessToken: '', httpCode: 500 };
    }

    }

    async refreshAuthInfo(): Promise<NuggetAuthUserInfo> {
      // call your refresh token API here , set this.accessToken = received token and return token as well as http code
        return {
            accessToken: this.accessToken,
            httpCode: 200, // return the actual http code received after calling API
        };
    }
}

interface NuggetSDKProviderProps {
    children: React.ReactNode;
    nameSpace: string; // nameSpace is required by NuggetJumborConfiguration
    initialAuthToken?: string;
}

export const NuggetSDKProvider: React.FC<NuggetSDKProviderProps> = ({
    children,
    nameSpace,
    initialAuthToken = '',
}) => {
    const sdk = useMemo(() => {
        const sdkConfig: NuggetJumborConfiguration = { nameSpace };
        const chatSupportBusinessContext: NuggetChatBusinessContext = {
            // channelHandle: 'channelHandle',
            // ticketGroupingId: 'ticketGroupingId-goes-here',
            // ticketProperties: {
            //     'ticketProperty1': ['value1', 'value2'],
            //     'ticketProperty2': ['value3', 'value4']
            // },
            // botProperties: {
            //     'botProperty1': ['value5', 'value6'],
            //     'botProperty2': ['value7', 'value8']
            // }
        };
       const lightModeAccentColorData : AccentColorData = {
          hex : '#FFF000',
       };
        const darkModeAccentColorData : AccentColorData = {
               hex : '#FFF000',
       };
        const fontData : FontData = {
             fontMapping : new Map<string, string>([
                 ['regular' , 'pixarRegular'],
             ]),
           };
        const handleDeeplinkInsideApp : boolean = false;
        const isDarkModeEnabled : boolean = false;
        const nuggetSDKInstance = NuggetSDK.getInstance(sdkConfig, chatSupportBusinessContext , handleDeeplinkInsideApp , lightModeAccentColorData , darkModeAccentColorData , fontData , isDarkModeEnabled);
        const authDelegate = new NuggetAuthProviderImpl('');
        nuggetSDKInstance.setAuthDelegate(authDelegate);
        return nuggetSDKInstance;
    }, [nameSpace, initialAuthToken]);

    const contextValue = useMemo(() => ({
        sdk,
        isInitialized: true,
    }), [sdk]);

    return (
        <NuggetSDKContext.Provider value={contextValue}>
            {children}
        </NuggetSDKContext.Provider>
    );
};

export const useNuggetSDK = () => {
    const context = useContext(NuggetSDKContext);
    if (!context) {
        throw new Error('useNuggetSDK must be used within a NuggetSDKProvider');
    }
    return context;
};
