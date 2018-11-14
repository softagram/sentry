import PropTypes from 'prop-types';
import React from 'react';

import {COLUMNS} from 'app/views/organizationDiscover/data';
import {defined} from 'app/utils';
import SentryTypes from 'app/sentryTypes';
import SmartSearchBar from 'app/components/smartSearchBar';
import withApi from 'app/utils/withApi';

/*
const KEY_SEPARATOR = '.';
const KEYS = COLUMNS.map(({name}) => {
  // e.g. `id` or `user.id`
  const [parent, child] = name.split(KEY_SEPARATOR);
  return [parent, child];
}).reduce((acc, [parent, child]) => {
  if (!acc[parent]) {
    acc[parent] = {
      key: parent,
      name: parent,
      description: `description of ${parent}`,
      children: {},
    };
  }

  acc[parent].children = {
    [child]: {
      key: child,
      name: child,
      description: `description of ${parent}${KEY_SEPARATOR}${child}`,
    },
  };

  return acc;
}, {});
*/
const TAGS = COLUMNS.map(({name}) => {
  return name;
}).reduce((acc, name) => {
  if (!acc[name]) {
    acc[name] = {
      key: name,
      name,
      description: `description of ${name}`,
    };
  }

  return acc;
}, {});

class SearchBar extends React.Component {
  static propTypes = {
    api: PropTypes.object,
    organization: SentryTypes.Organization,
  };

  /**
   * Returns array of tag values that substring match `query`; invokes `callback`
   * with data when ready
   */
  getTagValues = (tag, query) => {
    let {organization} = this.props;

    return this.props.api
      .requestPromise(`/organizations/${organization.slug}/tags/${tag.key}/values/`, {
        data: {
          query,
        },
        method: 'GET',
      })
      .then(
        results => results.filter(({value}) => defined(value)).map(({value}) => value),
        () => {
          throw new Error('Unable to fetch project tags');
        }
      );
  };

  render() {
    return (
      <SmartSearchBar
        {...this.props}
        onGetTagValues={this.getTagValues}
        supportedTags={TAGS}
      />
    );
  }
}

export default withApi(SearchBar);
