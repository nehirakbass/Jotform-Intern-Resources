import React from 'react'
import { connect } from 'react-redux'
import NavBar from './NavBar';
import fire from '../Firebase/Fire'
import { Container, Table, Button, Header, Divider, Icon, Card, Grid, Modal, Comment, Form, Message } from 'semantic-ui-react';
import { navigate } from '@reach/router'

class Profile extends React.Component {
    constructor() {
        super()

        this.state = {
            resources: [],
            favourites: [],
            user: {}
        }
    }

    getUserResources = async () => {
        const db = fire.firestore()
        let restQuery = await db.collection('Resources')
        let dbSnapshots = await restQuery.get()
        let dbData = dbSnapshots.docs.map(res => res.data())
        this.setState({ resources: dbData })

        db.collection('Users').doc(this.props.userMail).get()
            .then(doc => {
                const data = doc.data()
                this.setState({ user: data })
            })
    }

    getUserFavourites = () => {
        const db = fire.firestore()

        const { userMail } = this.props

        db.collection('Users').doc(userMail).get()
            .then((docSnapShot) => {
                const data = docSnapShot.data()
                this.setState({ favourites: data.Favourites })
            })
    }

    deleteResource = (single) => {
        const db = fire.firestore()

        const { userMail } = this.props
        const { favourites } = this.state

        db.collection('Resources').doc(single.rTitle).delete()

        this.getUserResources()

        db.collection('Users').doc(userMail).get()
            .then((docSnapShot) => {
                if (!docSnapShot.exists) {
                    return
                } else {
                    db.collection('Users').doc(userMail).update({
                        Favourites: favourites.filter(item => item.rId !== single.rId)
                    })
                    this.getUserFavourites()
                }
            })
    }

    componentWillMount() {
        this.getUserResources()
        this.getUserFavourites()
    }

    render() {
        const { favourites, resources, user } = this.state
        const { userName, userMail } = this.props
        return <div>
            <NavBar />
            <div className="mainPage-2">
                <br />
                <Container>
                    <Header>Your Resources</Header>
                    <br />
                    <Table basic='very' celled fixed singleLine striped>
                        <Table.Header>
                            <Table.Row textAlign="center">
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell>Submitted At</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Remove</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {resources.map((single) => {
                                if ((single.rSubmittedBy === userName) && (single.rSubmitterMail === userMail) && (single.rType !== ("intern project"))) {
                                    return <Table.Row textAlign="center">
                                        <Table.Cell>{single.rTitle}</Table.Cell>
                                        <Table.Cell>{single.createdAt}</Table.Cell>
                                        <Table.Cell>
                                            <Icon name={single.rStatus === "approved" ? "check" : single.rStatus === "waiting" ? "clock outline" : "close"
                                            } />
                                        </Table.Cell>
                                        <Table.Cell><Button onClick={() => { this.deleteResource(single) }} basic icon="trash alternate outline" /></Table.Cell>
                                    </Table.Row>
                                }
                            })}
                        </Table.Body >
                    </Table>
                    <Divider />
                    {
                        user.uPosition === "Intern" ? <div>
                            <br /><br />
                            <Header>Your Projects</Header>
                            <Table basic='very' celled fixed singleLine striped>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Project Title</Table.HeaderCell>
                                        <Table.HeaderCell>Your Mentor</Table.HeaderCell>
                                        <Table.HeaderCell>Technologies You Have Used</Table.HeaderCell>

                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {resources.map((single) => {
                                        if (single.rType === "intern project" && (single.rSubmittedBy === userName) && (single.rSubmitterMail === userMail)) {
                                            return <Table.Row textAlign="center">
                                                <Table.Cell>{single.projectTitle}</Table.Cell>
                                                <Table.Cell>{single.mentor}</Table.Cell>
                                                <Table.Cell>{single.technologies}</Table.Cell>
                                            </Table.Row>
                                        }
                                    })}
                                </Table.Body>
                            </Table>
                        </div> : null
                    }
                    <br /><br />
                    <Header>Your Favourites</Header>
                    <Card.Group itemsPerRow="3">
                        {favourites.map((single) => {
                            if (favourites.length === 0) {
                                return <Message content="You dont have any favourites right now" />
                            }
                            else if (single.rStatus === "approved") {
                                return <Card raised>
                                    <Card.Content textAlign="left">
                                        <Card.Header>
                                            <Grid divided columns={3}>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        {single.rType === "intern project" ? single.projectTitle : single.rTitle}
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Card.Header>
                                        <Card.Meta>Submitted by {single.rSubmittedBy} at {single.createdAt}</Card.Meta>
                                        <Card.Description>
                                            {single.rNotes.length > 45 ? (single.rNotes.substring(0, 48) + "...") : single.rNotes}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <div className="ui three buttons">
                                            <Button href={single.rUrl} basic color='green'>
                                                Go to Resource
                                            </Button>
                                            <Button basic onClick={() => { navigate(`/resources/${single.rId}`) }} color='olive'>
                                                View Details
                                            </Button>
                                            <Modal size="mini" centered trigger={<Button basic color='orange'>
                                                View Comments
                                            </Button>}>
                                                <Modal.Description>
                                                    <Comment.Group>
                                                        <Header as='h3' dividing>
                                                            Comments
                                                    </Header>
                                                        <Form>
                                                            {single.comments.map((singleComment) => <Comment>
                                                                <Comment.Avatar src={singleComment.authorAvatar} />
                                                                <Comment.Content>
                                                                    <Comment.Author as='a'>{singleComment.author}</Comment.Author>
                                                                    <Comment.Metadata><div>replied at{singleComment.repliedAt}</div></Comment.Metadata>
                                                                    <Comment.Text>{singleComment.text}</Comment.Text>
                                                                </Comment.Content>
                                                            </Comment>
                                                            )}
                                                            <Form.TextArea onChange={this.onChangeComment} />
                                                            <Button onClick={() => { this.submitComment(single) }} content='Add Reply' labelPosition='right' icon='edit' basic />
                                                        </Form>
                                                    </Comment.Group>
                                                </Modal.Description>
                                            </Modal>
                                        </div>
                                    </Card.Content>
                                </Card>
                            }
                        })}
                    </Card.Group>
                </Container>
            </div>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        userMail: state.preLoginReducers.userMail,
        userName: state.preLoginReducers.userName
    }
}

export default connect(mapStateToProps, null)(Profile)