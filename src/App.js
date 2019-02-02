import React, { Component } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Columns from "react-columns";

const mobileMaxWidth = 600;
const fullWidth = 900;

// For Product list
const gap = 8.5;

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
    const sidebarWidth = isFullWidth ? (width - fullWidth) / 3 + 300 : 300;

    // For Product list
    let columns = 2;
    let itemSide;

    if (isFullWidth) {
      itemSide = (sidebarWidth - gap * 3) / columns;
    } else {
      // Handle funky issue where there is no right padding
      let bodyWidth = width - gap * 3;
      itemSide = (bodyWidth - gap * 3) / columns;
    }

    return {
      isFullWidth,
      isMobile,
      itemSide,
      columns,
      sidebarWidth
    };
  }

  renderProduct() {
    const { isFullWidth, isMobile, sidebarWidth } = this.state;
    const { width } = this.state.window;
    const productContainerWidth = 600;
    const styles = StyleSheet.create({
      product: {
        width: isFullWidth ? width - sidebarWidth : "100%",
        alignItems: "center",
        backgroundColor: "blue",
        paddingVertical: 144
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
    const { isFullWidth, sidebarWidth } = this.state;
    const { width } = this.state.window;
    const containerWidth = isFullWidth ? sidebarWidth : width;
    const styles = StyleSheet.create({
      container: {
        width: containerWidth
      }
    });
    return <View style={styles.container}>{this.renderColumns()}</View>;
  }

  renderItems(style) {
    const itemViews = [];
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    for (let i = 0; i < items.length; i++) {
      itemViews.push(<View key={i} style={style} />);
    }
    return itemViews;
  }

  renderColumns() {
    const { columns, itemSide, isFullWidth } = this.state;
    const { height } = this.state.window;
    const fullWidthBody = isFullWidth ? { height } : {};
    const styles = StyleSheet.create({
      body: {
        ...fullWidthBody,
        marginLeft: isFullWidth ? gap + "px" : gap * 1.5 + "px",
        // Handle funky issue where there is no right padding
        marginRight: isFullWidth ? "0px" : gap * 2 + "px",
        alignItems: "center"
      },
      content: {
        flex: 1
      },
      contentContainer: {
        paddingTop: gap * 2,
        paddingRight: gap
      },
      item: {
        width: itemSide,
        height: itemSide,
        backgroundColor: "tomato",
        marginBottom: isFullWidth ? gap : gap * 2
      }
    });
    return (
      <View style={styles.body}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Columns columns={columns} gap={gap + "px"}>
            {this.renderItems(styles.item)}
          </Columns>
        </ScrollView>
      </View>
    );
  }

  render() {
    const { isFullWidth } = this.state;
    const styles = StyleSheet.create({
      app: {
        flex: 1,
        flexDirection: isFullWidth ? "row" : "column"
      }
    });
    if (isFullWidth) {
      return (
        <View style={styles.app}>
          {this.renderProductList()}
          {this.renderProduct()}
        </View>
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
