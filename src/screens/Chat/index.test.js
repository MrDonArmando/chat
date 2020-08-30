import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import App from "./index";
import Chat from ".";
import ContactList from "../ContactList";
import RightPanel from "../RightPanel";

it("renders without crashing", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.contains(<Chat />)).to.equal(true);
  expect(wrapper.find("div").childAt(0).type()).to.equal(ContactList);
  //expect(wrapper.find("div").children().toEqual("Chat");
  expect(
    wrapper.contains(
      <div className="container-main">
        <ContactList />
        <Chat />
        <RightPanel />
      </div>
    )
  ).to.equal(true);
  console.log(wrapper.debug());
  expect(wrapper.find(Chat)).to.have.lengthOf(1);
  expect(wrapper.find(Chat).dive().find("#container-chat")).to.have.lengthOf(1);
});
