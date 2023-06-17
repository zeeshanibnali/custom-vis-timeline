"use client";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import vis, { Timeline } from "vis";
const Home = () => {
  // specify options

  var VisTimeline = () => {
    var timeline: Timeline;

    // create groups
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
    var items = new vis.DataSet();
    var itemsPerGroup = Math.round(numberOfItems / numberOfGroups);
    for (var truck = 0; truck < numberOfGroups; truck++) {
      var date = new Date();
      for (var order = 0; order < itemsPerGroup; order++) {
        let randomeness: number = Math.random() < 0.2 ? 1 : 0;
        date.setHours(date.getHours() + 4 * randomeness);
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

    function initTimeline() {
      let container = document.getElementById("visualization");
      timeline = new vis.Timeline(container!, items, groups, options!);
    }

    useEffect(() => {
      initTimeline();
    });

    let GroupTemplate = (props: any) => {
      var { group } = props;
      console.log("GROUP", group);
      return (
        <div>
          <p style={{ color: "white" }}>{group.content} </p>
        </div>
      );
    };

    let ItemTemplate: React.FC = (props: any) => {
      var { item } = props;
      return (
        <div>
          <label>{item.content}</label>
        </div>
      );
    };

    var options = {
      orientation: "top",
      maxHeight: 400,
      start: new Date(),
      end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
      editable: true,
      onInitialDrawComplete: () => {
        timeline.setItems(items);
      },
      template: function (item: any, element: any) {
        return ReactDOM.createPortal(
          ReactDOM.render(<ItemTemplate item={item} />, element),
          element,
          () => {
            timeline.redraw();
          }
        );
        // if (!item) {
        //   return;
        // }
        // ReactDOM.unmountComponentAtNode(element);
        // return <ItemTemplate item={item} />;
      },
      groupTemplate: function (group: any, element: any) {
        return ReactDOM.createPortal(
          ReactDOM.render(<GroupTemplate group={group} />, element),
          element,
          () => {
            timeline.redraw();
          }
        );
        // if (!group) {
        //   return;
        // }
        // ReactDOM.unmountComponentAtNode(element);
        // return <GroupTemplate group={group} />;
      },
    };

    return (
      <div>
        <h1>Vis timline with React</h1>
        <h2>Using react components for items and group templates</h2>
        <div style={{ backgroundColor: "#0B2032" }} id="visualization"></div>
      </div>
    );
  };
  return <VisTimeline />;
};

export default Home;
