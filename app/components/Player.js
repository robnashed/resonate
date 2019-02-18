import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { Button } from "./Button";
import { AlbumVis } from "./AlbumVis";
import { PlayControl } from "./PlayControl";
import { Colors } from "../styles/Colors";
import { PlayerBar } from "./PlayerBar";
import GestureRecognizer from "react-native-swipe-gestures";
import { connect } from "react-redux";
import { togglePlayerView } from "./../redux/reducers/player.reducer";
/* import Modal from "react-native-modal"; */

class Player extends Component {
  /**
   *
   * @param {required} props
   * Use the class constructor to set the initial state
   * for your component.
   */
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: {
        title: "Track Name",
        artist: "Artist Name",
        album:
          "https://images-na.ssl-images-amazon.com/images/I/A1QsthUoerL._SY355_.jpg"
      }
    };
  }

  /**
   * Handle minimization of player view
   */
  minimize() {
    console.log("click - close the player");
    console.log(this.props.isFull);
    this.props.toggle();
  }

  onSwipeDown() {
    console.log("swipe down - close the player");
    console.log(this.props.isFull);
    this.props.toggle();
  }

  /**
   * Handle swipe-up event on player bar to open player compo/view
   */
  onSwipeUp() {
    console.log("swiped up - open the player");
    console.log(this.props.isFull);
    this.props.toggle();
  }

  render() {
    return (
      // Container View
      <View>
        <GestureRecognizer onSwipeUp={() => this.onSwipeUp()}>
          <PlayerBar isVisible={!this.props.isFull} />
        </GestureRecognizer>

        <GestureRecognizer onSwipeDown={() => this.onSwipeDown()}>
        <Modal visible={this.props.isFull} animationType={"slide"}>
        <View style={styles.container}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={this.minimize.bind(this)}
            >
              <Button type="minimize" />
            </TouchableOpacity>

            <View style={styles.trackImage}>
              <AlbumVis
                albumSource={this.state.currentTrack.album}
                size={200}
              />
            </View>

            <View style={styles.trackInfo}>
              <Text style={[styles.infoText, styles.titleText]}>
                {this.state.currentTrack.title}
              </Text>
              <Text style={[styles.infoText, styles.artistText]}>
                {this.state.currentTrack.artist}
              </Text>
            </View>

            <View style={styles.row}>
              <TouchableOpacity>
                <Button type="pl-star" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Button type="pl-shuffle" />
              </TouchableOpacity>
            </View>

            <PlayControl />
          </View>
        </Modal>
        </GestureRecognizer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 40,
    paddingTop: 50,
    backgroundColor: Colors.defaultBg
  },
  trackImage: {
    marginVertical: 75
  },
  trackInfo: {
    marginTop: 10
  },
  infoText: {
    fontFamily: "Avenir",
    color: Colors.defaultFont,
    textAlign: "center"
  },
  titleText: {
    fontSize: 25
  },
  artistText: {
    fontSize: 20,
    fontWeight: "100"
  },
  row: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
    justifyContent: "space-around",
    paddingHorizontal: 80
  }
});

// This function provides a means of sending actions so that data in the Redux store
// can be modified. In this example, calling this.props.addToCounter() will now dispatch
// (send) an action so that the reducer can update the Redux state.
function mapDispatchToProps(dispatch) {
  return {
    toggle: () => dispatch(togglePlayerView())
  };
}

// This function provides access to data in the Redux state in the React component
// In this example, the value of this.props.count will now always have the same value
// As the count value in the Redux state
function mapStateToProps(state) {
  return {
    isFull: state.player.isFull
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);