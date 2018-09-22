import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './repoTable.css';

class RepoTable extends Component {
  handleAction = (repo) => {
    this.props.actionFunction(repo);
  }

	render() {
    const resultRows = this.props.data.map(repo =>
      <tr key={repo.name}>
        <td><a className="repo-url" href={repo.html_url}>{repo.name}</a></td>
        <td>{repo.language ? repo.language : '-'}</td>
        <td>{repo.tag ? repo.tag : '-'}</td>
        {repo.actionFlag && <td><span className="action-cell" value={repo.name} onClick={event => this.handleAction(repo)}>{this.props.action}</span></td>}
      </tr>
    );
		return (
			<div className="repo-table-container">
				<table className="repo-table">
					<tbody>
            {resultRows.length > 1 && 
            <tr className="table-headers">
              <td>Name</td>
              <td>Language</td>
              <td>Latest tag</td>
            </tr>}
            {resultRows}
          </tbody>
				</table>
			</div> 
		);
	}
}

RepoTable.propTypes = {
	data: PropTypes.array,
  action: PropTypes.string,
  actionFunction: PropTypes.func
}

export default RepoTable;