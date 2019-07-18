import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Alert,
  Text,
  Image,
} from 'react-native';
import LinkPreview from 'react-native-link-preview';

export class MyText extends React.Component {
  constructor (props) {
    super (props);
    this._isMounted = false;
    this.state = {
      text: [{component: 'text', value: this.props.children}],
    };
  }
  async componentDidMount () {
    this._isMounted = true;
    let text = this.props.children;
    let links = text.match (
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
    );
    let previews = [];
    if (links != null) {
      for (var i = 0; i < links.length; i++) {
        let data = await LinkPreview.getPreview (links[i]);
        if (data.contentType == 'text/html; charset=utf-8') {
          previews.push ({
            image: data.images[0],
            url: data.url,
            original: links[i],
            title: data.title,
          });
        }
      }
    }
    let components = [];
    previews.forEach (preview => {
      let splitText = text.split (preview.original);
      if (splitText.length == 1) {
        components.push({component: "text", value: splitText[0]});
        text = splitText[0];
      } else if (splitText.length == 2) {
        if (splitText[0] === "") {
            components.push({component: "text", value: splitText[0]});
            text = splitText[1];
        } else {
            components.push({component: "text", value: splitText[0]});
            text = splitText[1];
        }
      } else {
        components.push({component: "text", value: splitText[0]});
        text = splitText[2];
      };
      if (splitText.length !== 1) {
          components.push({component: "image", ...preview})
      }
    });
    components.push({component: "text", value: text});
    console.log(components);
  }
  componentWillUnmount () {
    this._isMounted = false;
  }
  render () {
    return (
      <View>
        {this.state.text.map ((component, index) => {
          component.component == 'text'
            ? <Text>{component.value}</Text>
            : <View>
                <Text>{component.title}</Text>
                <Image source={{uri: component.url}} />
              </View>;
        })}
      </View>
    );
  }
}
