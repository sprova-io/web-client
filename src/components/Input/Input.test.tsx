import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import Input from './Input';

describe('<Input />', () => {
  it('renders an `input`', () => {
    const handleChange = sinon.spy();
    const value = '';
    const wrapper = shallow(<Input onChange={handleChange} value={value} />);
    expect(wrapper.contains('input')).toEqual(true);
  });
});
