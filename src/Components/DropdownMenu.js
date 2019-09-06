import React from 'react'
import { setSearchType } from '../Redux/Actions/postLoginActions'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'

class DropdownMenu extends React.Component {
    render() {
        const { setSearchType } = this.props
        return <Dropdown className="dropdown" text="Select a Filter" icon="filter">
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSearchType("Submitted By")}>Submitted By</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchType("Title")}>Title</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchType("Tags")}>Tags</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSearchType: (type) => (dispatch(setSearchType(type)))
    }
}

export default connect(null, mapDispatchToProps)(DropdownMenu)