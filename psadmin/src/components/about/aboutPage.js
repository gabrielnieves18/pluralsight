"use strict";

var React = require("react");

var About = React.createClass({
  render: function() {
    return (
      <div>
        <h1>About</h1>
        <p>
          This application uses the following technologies:
          <ul>
            <li>React Router</li>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
          </ul>
        </p>
      </div>
    );
  }
});

module.exports = About;