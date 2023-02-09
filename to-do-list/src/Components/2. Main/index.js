import React, { Component } from 'react';

class ToDoItem extends Component {
  render() {
    const { text, completed, onClick } = this.props;
    return (
      <li
        style={{
          textDecoration: completed ? 'line-through' : 'none'
        }}
        onClick={onClick}
      >
        {text}
      </li>
    );
  }
}

class ToDoList extends Component {
  render() {
    const { items, onItemClick } = this.props;
    return (
      <ul>
        {items.map((item, index) => (
          <ToDoItem key={index} {...item} onClick={() => onItemClick(index)} />
        ))}
      </ul>
    );
  }
}

class ToDoApp extends Component {
  state = {
    items: [
      { text: 'Learn React', completed: false },
      { text: 'Build ToDo App', completed: false },
      { text: 'Profit', completed: false }
    ],
    filter: 'all'
  };

  handleItemClick = index => {
    const newItems = [...this.state.items];
    newItems[index].completed = !newItems[index].completed;
    this.setState({ items: newItems });
  };

  handleFilterChange = filter => {
    this.setState({ filter });
  };

  handleAddClick = () => {
    const newItems = [...this.state.items];
    newItems.push({ text: this.input.value, completed: false });
    this.setState({ items: newItems });
    this.input.value = '';
  };

  handleDeleteClick = index => {
    const newItems = [...this.state.items];
    newItems.splice(index, 1);
    this.setState({ items: newItems });
  };

  filteredItems() {
    const { items, filter } = this.state;
    if (filter === 'all') {
      return items;
    }
    return items.filter(item => (filter === 'completed' ? item.completed : !item.completed));
  }

  render() {
    return (
      <div>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={this.handleAddClick}>Add</button>
        <ToDoList items={this.filteredItems()} onItemClick={this.handleItemClick} />
        <div>
          Show:
          <button onClick={() => this.handleFilterChange('all')}>All</button>
          <button onClick={() => this.handleFilterChange('active')}>Active</button>
          <button onClick={() => this.handleFilterChange('completed')}>Completed</button>
        </div>
      </div>
    );
  }
}

export default ToDoApp;