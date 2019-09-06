import React from 'react'
import NavBar from './NavBar';
import { Container, Divider, Message, Icon, Accordion, Button, Comment, Header, Form, Modal, Popup } from 'semantic-ui-react';
import fire from '../Firebase/Fire'
import firebase from 'firebase'



export default class Single extends React.Component {
    constructor() {
        super()

        this.state = {
            single: {},
            comment: ""
        }
    }



    componentWillMount() {
        const id = this.props.id

        const db = fire.firestore()

        db.collection('Resources').doc(id).get()
            .then((docSnapShot) => {
                const data = docSnapShot.data()

                this.setState({ single: data })
            })
    }

    onChangeComment = (e) => {
        this.setState({ comment: e.target.value })
    }

    submitComment = (single) => {
        if (this.state.comment) {
            const db = fire.firestore()

            const comment = {
                text: this.state.comment,
                author: this.props.userName,
                avatar: this.props.userAvatar,
                repliedAt: new Date().toLocaleString()
            }

            db.collection("Resources").doc(single.rId).update({
                comments: firebase.firestore.FieldValue.arrayUnion(comment)
            })

        } else {
            return
        }
    }

    render() {
        const { single } = this.state

        const panels = [
            {
                key: 'tags',
                title: 'Click to see the Tags',
                content: single.rTags
            }
        ]
        return <div>
            <NavBar />
            <div className="mainPage">
                <div className="single-res-page">
                    <Container textAlign="left">
                        <Message>
                            <Message color="yellow" icon>
                                <Icon name="user" />
                                <Message.Content>
                                    <Message.Header>Submission Details</Message.Header>
                                    <Divider />
                                    Submitted by:  {single.rSubmittedBy}
                                    <br />
                                    Submission Date: {single.createdAt}
                                </Message.Content>
                            </Message>
                            <Divider />
                            <Message color="olive" icon>
                                <Icon name="file alternate" />
                                <Message.Content>
                                    <Message.Header>{single.rType === "intern project" ? "Project Details" : "Resource Details"}</Message.Header>
                                    <Divider />
                                    {single.rType === "intern project" ?
                                        <div>
                                            Category: {single.rCategory}
                                            <br />
                                            Project Title:  {single.projectTitle}
                                            <br />
                                            Project's Mentor:  {single.mentor}
                                            <br />
                                            Technologies Used:  {single.technologies}
                                            <br />
                                            Description: {single.rNotes}
                                            <br />
                                            <Accordion panels={panels} />
                                        </div> :
                                        <div>
                                            Category: {single.rCategory}
                                            <br />
                                            Resource Title: {single.rTitle}
                                            <br />
                                            Description: {single.rNotes}
                                            <br />
                                            <Accordion panels={panels} />
                                        </div>}
                                </Message.Content>
                            </Message>
                            <Divider />
                            <Message color="grey" icon>
                                <Icon name="cogs" />
                                <Message.Content>
                                    <Message.Header>Actions</Message.Header>
                                    <Divider />
                                    <Button.Group fluid textAlign="center">
                                        <Button href={single.rUrl} basic color='green'>
                                            Go to Resource
                                            </Button>
                                        <Modal size="mini" centered trigger={<Button basic color='olive'>
                                            View Comments
                                            </Button>}>
                                            <Modal.Description>
                                                <Comment.Group>
                                                    <Header as='h3' dividing>
                                                        Comments
                                                    </Header>
                                                    {/* 
                                                    {console.log(single.comments)}
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
                                                        <Button onClick={() => { this.submitComment(single) }} content='Add Reply' labelPosition='right' icon='edit' basic />}
                                                    </Form> */}
                                                </Comment.Group>
                                            </Modal.Description>
                                        </Modal>
                                        <Button onClick={navigator.clipboard.writeText(window.location.href)} basic color="orange">Copy URL to Clipboard</Button>
                                        {/*     <Popup position="center" on="click" content="Copied" trigger={<Button onClick={navigator.clipboard.writeText(window.location.href)} basic color="orange">Copy URL to Clipboard</Button>} />
                                     */}</Button.Group>
                                </Message.Content>
                            </Message>
                        </Message>
                    </Container>
                </div>
            </div>
        </div>
    }
}
