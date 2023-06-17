"use client";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import vis, { Options } from "vis";

const Home = () => {
  // specify options

  var VisTimeline = () => {
    let timeline;
    var numberOfGroups = 25;
    var groups = new vis.DataSet();
    for (var i = 0; i < numberOfGroups; i++) {
      groups.add({
        id: i,
        content: "Truck " + i,
      });
    }

    // create items
    var numberOfItems = 1000;
    let items = new vis.DataSet();
    var itemsPerGroup = Math.round(numberOfItems / numberOfGroups);
    for (var truck = 0; truck < numberOfGroups; truck++) {
      var date = new Date();
      for (var order = 0; order < itemsPerGroup; order++) {
        date.setHours(date.getHours() + 4 * (Math.random() < 0.2));
        var start = new Date(date);
        date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
        var end = new Date(date);
        items.add({
          id: order + itemsPerGroup * truck,
          group: truck,
          start: start,
          end: end,
          content: "Order " + order,
        });
      }
    }
    var GroupTemplate = (group: any) => {
      return (
        <div>
          <label>{group.content}</label>
        </div>
      );
    };

    class ItemTemplate extends React.Component {
      constructor(props: any) {
        super(props);
      }
      render() {
        return (
          <div>
            <label>{this.props.item.content}</label>
            <button
              onClick={() => {
                return console.log(this.props.item);
              }}
            >
              aaaa
            </button>
          </div>
        );
      }
    }

    class VisibleFramTemplate extends React.Component {
      constructor(props: any) {
        super(props);
      }
      render() {
        return (
          <div>
            id: {this.props.item.id}
            <button
              onClick={() => {
                return console.log("aaaaaa");
              }}
            >
              aaaa
            </button>
          </div>
        );
      }
    }
    var options = {
      orientation: "top",
      maxHeight: 400,

      start: new Date(),
      end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
      editable: false,
      onInitialDrawComplete: () => {
        timeline.setItems(items);
      },
      template: function (item, element) {
        if (!item) {
          return;
        }

        return ReactDOM.createPortal(
          ReactDOM.render(<ItemTemplate item={item} />, element),
          element,
          () => {
            timeline.redraw();
          }
        );

        // Works too
        // return ReactDOMServer.renderToString(<ItemTemplate item={item} />)

        // Kinda works
        // ReactDOM.render(<ItemTemplate item={item} />, element );
        // return ''
      },

      groupTemplate: function (group: any, element: any) {
        if (!group || !group.content) {
          return;
        }
        return ReactDOM.createPortal(
          ReactDOM.render(<GroupTemplate group={group} />, element),
          element
        );
      },

      visibleFrameTemplate: function (item: any, element: any) {
        if (!item || !element) {
          return;
        }
        if (element.className.indexOf("timeline-item-visible-frame") === -1) {
          return;
        }
        return ReactDOM.createPortal(
          ReactDOM.render(<VisibleFramTemplate item={item} />, element),
          element
        );
      },
    };

    useEffect(() => {
      initTimeline();
    });
    function initTimeline() {
      var container = document.getElementById("visualization");
      timeline = new vis.Timeline(container!, items, groups, options);
    }
    return (
      <div>
        <h1>Vis timline with React</h1>
        <h2>Using react components for items and group templates</h2>
        <div id="visualization"></div>
      </div>
    );
  };
  return <VisTimeline />;
};

export default Home;
