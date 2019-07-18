import React from 'react';
import {
  View,
  Modal as ReactModal,
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';



export default class ImageViewerModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      index: 0,
      images: [],
    };
    this._isMounted = false;
  }
  swipeDown = () => {
    this._isMounted && this.setState ({isBackdropVisible: false});
  };
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render () {
    return (
      <View>
        <ReactModal
          visible={this.state.isBackdropVisible}
          transparent={true}
          onRequestClose={() => this._isMounted && this.setState ({modalVisible: false})}
        >
          <ImageViewer
            onSwipeDown={this.swipeDown}
            enableSwipeDown={true}
            enablePreload={false}
            index={this.state.index}
            imageUrls={this.state.images}
          />
        </ReactModal>
      </View>
    );
  }
}