import React from 'react'
import { connect } from 'react-redux'
import * as postLoginActions from '../Redux/Actions/postLoginActions'
import fire from '../Firebase/Fire'
import { Redirect } from '@reach/router'
import { Container, Form, Message, Icon, Button } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

class InterPage extends React.Component {
    constructor() {
        super()

        this.state = {
            timeToGo: false
        }
    }
    credentials = {
        position: '',
        team: '',
    }

    onChangePos = (e) => {
        this.credentials.position = e.target.value
    }

    onChangeTeam = (e) => {
        this.credentials.team = e.target.value
    }

    onSubmit = () => {
        const { position, team } = this.credentials
        const { userMail } = this.props
        const db = fire.firestore()
        /* db.collection("Users").doc(userMail).update({
            uName: this.props.userName,
            uMail: this.props.userMail,
        }) */

        db.collection('Users').doc(userMail).update({
            uPosition: position,
            uTeam: team
        })
  
        this.props.setCreds(position, team)

        this.setState({ timeToGo: true })
    }

    componentDidMount() {
        const db = fire.firestore()

        db.collection("Users").doc(this.props.userMail).get().then(
            u => {
                this.credentials.tmpFlag = u.flag
            }
        )
    }

    render() {
        if (this.state.timeToGo) {
            return <Redirect to="/resources" />
        }
        return <div className="inter">
            <Container textAlign="center">
                <Message attached
                    content="Welcome, Before going forward, please fill the form below."
                />
                <Form className="attached fluid segment">
                    <Form.Input required label='Position' type='text' onChange={this.onChangePos} />
                    <Form.Input required label='Team' type='text' onChange={this.onChangeTeam} />
                    <Message content="If you are an intern please fill the Team value for your Mentor's Team" />
                    <Button textAlign="center" animated type='submit' color="green" onClick={this.onSubmit}>
                        <Button.Content visible>
                            Submit
                        </Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                        </Button>
                </Form>
            </Container>
        </div>

    }
}

function mapStateToProps(state) {
    return {
        userName: state.preLoginReducers.userName,
        userMail: state.preLoginReducers.userMail,
        uId: state.postLoginReducers.uId
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(postLoginActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InterPage)