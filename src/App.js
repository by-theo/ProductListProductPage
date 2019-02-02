import React, { Component } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

const mobileMaxWidth = 600;
const fullWidth = 900;
const sidebarWidth = 300;

class App extends Component {
  constructor(props) {
    super(props);
    const window = Dimensions.get("window");
    const measurements = this.calculateMeasurements({ window });
    this.state = {
      window,
      ...measurements
    };
  }

  componentWillMount() {
    Dimensions.addEventListener("change", this.handler);
  }

  componentWillUnmount() {
    // Important to stop updating state after unmount
    Dimensions.removeEventListener("change", this.handler);
  }

  handler = dims => {
    const measurements = this.calculateMeasurements(dims);
    this.setState({
      ...dims,
      ...measurements
    });
  };

  calculateMeasurements(dims) {
    const { width } = dims.window;
    const isMobile = mobileMaxWidth >= width;
    const isFullWidth = fullWidth <= width;
    return {
      isFullWidth,
      isMobile
    };
  }

  renderProduct() {
    const { isFullWidth, isMobile } = this.state;
    const { width } = this.state.window;
    const productContainerWidth = 600;
    const styles = StyleSheet.create({
      product: {
        width: isFullWidth ? width - sidebarWidth : "100%",
        alignItems: "center",
        backgroundColor: "blue",
        paddingVertical: 120
      },
      productContainer: {
        width: isMobile ? productContainerWidth / 2 : productContainerWidth,
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: "center"
      },
      productImageContainer: {
        width: productContainerWidth / 2,
        height: productContainerWidth / 2,
        backgroundColor: "tomato"
      },
      productDetailsContainer: {
        minWidth: productContainerWidth / 2,
        height: productContainerWidth / 2,
        backgroundColor: "aquamarine"
      }
    });
    return (
      <View style={styles.product}>
        <View style={styles.productContainer}>
          <View style={styles.productImageContainer} />
          <View style={styles.productDetailsContainer} />
        </View>
      </View>
    );
  }

  renderProductList() {
    const { isFullWidth } = this.state;
    const { height, width } = this.state.window;
    const containerWidth = isFullWidth ? 300 : width;
    const styles = StyleSheet.create({
      container: {
        width: containerWidth,
        height: height,
        backgroundColor: "pink"
      }
    });
    return <View style={styles.container} />;
  }

  render() {
    const { isFullWidth } = this.state;
    const styles = StyleSheet.create({
      app: {
        flex: 1,
        flexDirection: isFullWidth ? "row" : "column",
        backgroundColor: "red"
      }
    });
    if (isFullWidth) {
      return (
        <ScrollView>
          <View style={styles.app}>
            {this.renderProductList()}
            {this.renderProduct()}
          </View>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView>
          <View style={styles.app}>
            {this.renderProduct()}
            {this.renderProductList()}
          </View>
        </ScrollView>
      );
    }
  }
}
export default App;
