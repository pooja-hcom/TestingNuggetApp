/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NuggetSDKProvider } from './NuggetSDKProvider';
import SampleScreen from './SampleScreen';
// import FastImage from '@d11/react-native-fast-image';

function App(): React.JSX.Element {

  return (
    <NuggetSDKProvider nameSpace="housing">
      <SampleScreen />
    </NuggetSDKProvider>
  );
}

export default App;
