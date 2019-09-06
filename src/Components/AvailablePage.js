import React from 'react'
import NavBar from './NavBar';
import fire from '../Firebase/Fire'
import { navigate } from '@reach/router'
import debounce from "lodash.debounce"
import DropdownMenu from './DropdownMenu';
import { connect } from 'react-redux'
import firebase from 'firebase'
import * as postLoginActions from '../Redux/Actions/postLoginActions'
import { bindActionCreators } from 'redux'
import { Input, Button, Modal, Grid, Form, Comment, Header, Card, Container, Popup } from 'semantic-ui-react'

class AvailablePage extends React.Component {
    constructor() {
        super()
        this.state = {
            filterWord: '',
            resources: [],
            comment: '',
            lastVisible: null,
            favourites: [],
            limit: 9
        }

        window.onscroll = debounce(() => {
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                this.loadMore()
            }
        })
    }

    componentWillMount() {
        this.loadInitial()
        this.getFavourites()
    }


    getFilterWord = (e) => {
        this.setState({ filterWord: e.target.value })
    }


    onChangeComment = (e) => {
        this.setState({ comment: e.target.value })
    }

    loadInitial = async () => {
        try {
            const db = fire.firestore()
            let initialQuery = await db.collection('Resources').orderBy('createdAt', 'asc').limit(this.state.limit)
            let dbSnapshots = await initialQuery.get()
            let dbData = dbSnapshots.docs.map(res => res.data())
            let _lastVisible = dbData[dbData.length - 1].createdAt
            this.setState({ resources: dbData, lastVisible: _lastVisible })
        } catch (error) {
            console.log(error)
        }
    }

    loadMore = async () => {
        try {
            const { lastVisible, limit, resources } = this.state
            const db = fire.firestore()
            let restQuery = await db.collection('Resources').orderBy('createdAt', 'asc').startAfter(lastVisible).limit(limit)
            let dbSnapshots = await restQuery.get()
            let dbData = dbSnapshots.docs.map(res => res.data())
            let _lastVisible = dbData[dbData.length - 1].createdAt
            this.setState({
                resources: [...resources, ...dbData],
                lastVisible: _lastVisible
            })
        } catch (error) {
            console.log(error)
        }
    }

    getFavourites = () => {
        const { userMail } = this.props
        const db = fire.firestore()

        db.settings({
            timestampsInSnapshots: true
        })

        db.collection('Users').doc(userMail).get()
            .then(doc => {
                const data = doc.data()
                if (data.Favourites !== null) {
                    this.setState({ favourites: data.Favourites })
                } else {
                    this.setState({ favourites: []})
                }
            })
    }

    addToFavourites = (single) => {
        const { userMail } = this.props

        const db = fire.firestore()

        db.collection('Users').doc(userMail).update({
            Favourites: firebase.firestore.FieldValue.arrayUnion(single)
        })
    }

    removeFromFavourites = (single) => {
        const { userMail } = this.props
        const { favourites } = this.state

        const db = fire.firestore()

        db.collection('Users').doc(userMail).update({
            Favourites: favourites.filter(item => item.rTitle !== single.rTitle)
        })
    }

    toggleFavourites = (single) => {
        const { favourites } = this.state
        console.log(single.rId)
        if (favourites.some(e => e.rId === single.rId)) {
            this.removeFromFavourites(single)
        } else {
            this.addToFavourites(single)
        }

        this.getFavourites()
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
        const { sType } = this.props
        const { resources, filterWord, favourites } = this.state
        let filteredResources = resources
        let search = filterWord.trim().toLowerCase()

        if (search.length > 0) {
            filteredResources = filteredResources.filter(function (single) {
                if (sType === "Tags") {
                    return single.rTags.toLowerCase().match(search)
                } else if (sType === "Title") {
                    return single.rTitle.toLowerCase().match(search)
                } else if (sType === "Submitted By") {
                    return single.rSubmittedBy.toLowerCase().match(search)
                }
            })
        }

        return <div>
            <NavBar />
            <div className="mainPage-2">
                <div className="test-3">
                    <div className="search-bar">
                        <Input icon='search' onChange={this.getFilterWord} placeholder='Search...' />
                        <DropdownMenu />
                    </div>
                </div>
                <Container>
                    <Card.Group itemsPerRow="3">
                        {filteredResources.map((single) => {
                            if (single.rStatus === "approved") {
                                return <Card raised>
                                    <Card.Content textAlign="left">
                                        <Card.Header>
                                            <Grid columns={3}>
                                                <Grid.Row centered>
                                                    <Grid.Column textAlign="left">
                                                        <Button.Group vertical labeled icon>
                                                            <Button
                                                                disabled
                                                                color={single.rType === "book" ? "brown" : (single.rType === "video" ? "olive" : "pink")}
                                                                icon={single.rType === "book" ? "sticky note" : (single.rType === "video" ? "video" : "student")}
                                                                content={single.rType === "book" ? "Document" : (single.rType === "video" ? "Video" : "Project")} />
                                                        </Button.Group>
                                                    </Grid.Column>
                                                    <Grid.Column textAlign="right">
                                                        <Popup on='click' basic content={(favourites.some(e => e.rTitle === single.rTitle)) ? "Added to Favourites" : "Removed from Favourites"}
                                                            trigger={<Button circular basic
                                                                icon={favourites.some(e => (e.rTitle === single.rTitle) && (e.rTags === single.rTags)) ? "heart" : "heart outline"}
                                                                onClick={() => { this.toggleFavourites(single) }} />} />
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row textAlign="left" columns="2">
                                                    <Grid.Column >
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
                                            <Modal size="mini" centered fluid trigger={<Button basic color='orange'>
                                                View Comments
                                            </Button>}>
                                                <Modal.Description centered>
                                                    <Comment.Group>
                                                        <Header as='h3' dividing>
                                                            Comments
                                                    </Header>
                                                        <Form>
                                                            {single.comments.map((singleComment) => <Comment>
                                                                <Comment.Content>
                                                                    <Comment.Avatar src={singleComment.avatar} />
                                                                    <Comment.Author as='a'>{singleComment.author}</Comment.Author>
                                                                    <Comment.Metadata><div>replied at {singleComment.repliedAt}</div></Comment.Metadata>
                                                                    <Comment.Text>{singleComment.text}</Comment.Text>
                                                                </Comment.Content>
                                                            </Comment>
                                                            )}
                                                            <Form.TextArea onChange={this.onChangeComment} />
                                                            <Button onClick={() => { this.submitComment(single) }} content='Add Reply' labelPosition='right' icon='edit' color="green" />
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
        sType: state.postLoginReducers.sType,
        userMail: state.preLoginReducers.userMail,
        userName: state.preLoginReducers.userName,
        userAvatar: state.preLoginReducers.userAvatar,
        favourites: state.postLoginReducers.favourites
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(postLoginActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailablePage)