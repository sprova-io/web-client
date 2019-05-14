import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import Card, { CardBody, CardFooter, CardHeader } from './Card';

describe('<Card />', () => {
  it('renders a `div.sprova-card`', () => {
    const wrapper = shallow(<Card />);
    expect(wrapper.find('div.sprova-card')).toHaveLength(1);
  });

  it('has class `is-clickable` when onClick prop is passed', () => {
    const handleClick = sinon.fake();
    const wrapper = shallow(<Card onClick={handleClick} />);
    expect(wrapper.hasClass('is-clickable')).toEqual(true);
  });

  it('has class `is-info` when status prop is `info`', () => {
    const wrapper = shallow(<Card status="info" />);
    expect(wrapper.hasClass('is-info')).toEqual(true);
  });

  it('renders a `div.sprova-card-status-bar` when status prop is passed', () => {
    const wrapper = shallow(<Card status="success" />);
    expect(wrapper.find('div.sprova-card-status-bar')).toHaveLength(1);
  });

  it('does not render a `div.sprova-card-status-bar` when status prop is null', () => {
    const wrapper = shallow(<Card status={null} />);
    expect(wrapper.find('div.sprova-card-status-bar')).toHaveLength(0);
  });

  it('renders children when passed in', () => {
    const child = <div className="child" />;
    const wrapper = shallow(<Card>{child}</Card>);
    expect(wrapper.contains(child)).toEqual(true);
  });

  it('simulates click events', () => {
    const handleClick = sinon.spy();
    const wrapper = shallow(<Card onClick={handleClick} />);
    wrapper.simulate('click');
    expect(handleClick).toHaveProperty('callCount', 1);
  });
});

describe('<CardBody />', () => {
  it('renders a `div.sprova-card-body.is-padded`', () => {
    const wrapper = shallow(<CardBody />);
    expect(wrapper.find('div.sprova-card-body.is-padded')).toHaveLength(1);
  });

  it('does not have class `is-padded` when padded prop is `false`', () => {
    const wrapper = shallow(<CardBody padded={false} />);
    expect(wrapper.hasClass('is-padded')).toEqual(false);
  });

  it('has class `is-darker` when darker prop is `true`', () => {
    const wrapper = shallow(<CardBody darker={true} />);
    expect(wrapper.hasClass('is-darker')).toEqual(true);
  });

  it('renders children when passed in', () => {
    const child = <div className="child" />;
    const wrapper = shallow(<CardBody>{child}</CardBody>);
    expect(wrapper.contains(child)).toEqual(true);
  });
});

describe('<CardFooter />', () => {
  it('renders a `div.sprova-card-footer.is-padded`', () => {
    const wrapper = shallow(<CardFooter />);
    expect(wrapper.find('div.sprova-card-footer.is-padded')).toHaveLength(1);
  });

  it('does not have class `is-padded` when padded prop is `false`', () => {
    const wrapper = shallow(<CardFooter padded={false} />);
    expect(wrapper.hasClass('is-padded')).toEqual(false);
  });

  it('has class `is-darker` when darker prop is `true`', () => {
    const wrapper = shallow(<CardFooter darker={true} />);
    expect(wrapper.hasClass('is-darker')).toEqual(true);
  });

  it('renders children when passed in', () => {
    const child = <div className="child" />;
    const wrapper = shallow(<CardFooter>{child}</CardFooter>);
    expect(wrapper.contains(child)).toEqual(true);
  });
});

describe('<CardHeader />', () => {
  it('renders a `div.sprova-card-header`', () => {
    const wrapper = shallow(<CardHeader />);
    expect(wrapper.find('div.sprova-card-header')).toHaveLength(1);
  });

  it('renders children when passed in', () => {
    const child = <div className="child" />;
    const wrapper = shallow(<CardHeader>{child}</CardHeader>);
    expect(wrapper.contains(child)).toEqual(true);
  });
});
