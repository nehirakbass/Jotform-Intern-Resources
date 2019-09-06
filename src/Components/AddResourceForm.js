import React from 'react'
import * as postLoginActionCreators from '../Redux/Actions/postLoginActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import fire from '../Firebase/Fire'
import NavBar from './NavBar'
import { Redirect } from '@reach/router'
import { Button, Form, Container, Message, Divider, Icon } from 'semantic-ui-react'

class AddResourceForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            type: '',
            isIntern: false,
            isResource: true,
        }
    }

    resource = {
        url: '',
        title: '',
        category: '',
        tags: '',
        submittedBy: '',
        projectTitle: '',
        mentor: '',
        technologies: '',
        notes: ''
    }

    state = {
        timeToGo: false
    }

    componentWillMount() {
        const db = fire.firestore()

        const { userMail } = this.props
        
        db.collection('Users').doc(userMail).get()
            .then(docSnapShot => {
                const user = docSnapShot.data()

                if(user.uPosition === "intern" || user.uPosition === "Intern" ){
                    this.setState({ isIntern: true })
                }else {
                    this.setState({ isIntern: false })
                }
            })
    }

    onChangeUrl = (e) => {
        this.resource.url = e.target.value
    }

    onChangeTitle = (e) => {
        this.resource.title = e.target.value
    }

    onChangeCategory = (e) => {
        this.resource.category = e.target.value
    }

    onChangeTags = (e) => {
        this.resource.tags = e.target.value
    }

    onChangeNotes = (e) => {
        this.resource.notes = e.target.value
    }

    onSubmit = () => {
        this.saveToFire()
        this.setState({ timeToGo: true })
    }

    saveToFire = () => {
        const res = this.resource
        const db = fire.firestore()

        db.settings({
            timestampsInSnapshots: true
        })

        const { type } = this.state
        
        const ref = db.collection('Resources').doc()

        const id = ref.id
        
        db.collection('Resources').doc(id).get()
        .then((docSnapShot) => {
            if (docSnapShot.exists) {
                return
            } else {
                db.collection("Resources").doc(id).set({
                    comments: [],
                    rUrl: res.url,
                    rType: type,
                    rTitle: res.title,
                    projectTitle: res.projectTitle,
                    mentor: res.mentor,
                    technologies: res.technologies,
                    rTags: res.tags,
                    rCategory: res.category,
                    rNotes: res.notes,
                    rStatus: 'waiting',
                    rSubmittedBy: this.props.userName,
                    rSubmitterMail: this.props.userMail,
                    rId: id,
                    createdAt: new Date().toLocaleString()
                })
            }
        }) 

    }

    setType = (type) => {
        this.setState({ type: type })
    }

    onChangeProTitle = (e) => {
        this.resource.projectTitle = e.target.value
    }

    onChangeMentor = (e) => {
        this.resource.mentor = e.target.value
    }

    onChangeTechnologies = (e) => {
        this.resource.technologies = e.target.value
    }

    render() {
        if (this.state.timeToGo) {
            return <Redirect to="/resources" />
        }

        const { isIntern,isResource } = this.state
        return <div>
            <NavBar />
            <div className="mainPage">
                <Container text textAlign="left" className="add-res-form">
                <Message content="After submitting your resource,you can track your resource's status at your profile page.
                    Also, please notice that you need to put 'https://' before your resource's url.
                    " />
                    <Divider />
                    <Form>
                        <Form.Group widths="equal">
                        <label>Resource Type</label>
                            <Form.Field label='Video' control='input' type='radio' onClick={() => { this.setType('video') ; this.setState({ isResource: true }) }} name="typeRadios" />
                            <Form.Field label='Book/Document' control='input' type='radio' onClick={() => { this.setType('book') ; this.setState({ isResource: true }) }} name="typeRadios" />
                            { isIntern ? <Form.Field label='Intern Project' control='input' type='radio' onClick={() => { this.setType('intern project') ; this.setState({ isResource: false }) }} name="typeRadios" /> : null}
                        </Form.Group>
                    
                        { isResource ? 
                        <div>
                        <Form.Field>
                            <label>Resource URL</label>
                            <input placeholder="ex: https://yourresource.com" onChange={this.onChangeUrl} required />
                        </Form.Field>
                        <Form.Field>
                            <label>Resource Title</label>
                            <input onChange={this.onChangeTitle} required />
                        </Form.Field>
                        <Form.Field className="res-form-category">
                            <label>Category</label>
                            <input onChange={this.onChangeCategory} placeholder="Web Development,Intern Project..."/>
                        </Form.Field>
                        <Form.Field>
                            <label>Tags</label>
                            <input onChange={this.onChangeTags} placeholder="Please put ',' after each tag." />
                        </Form.Field>
                        <Form.Field>
                                <Form.TextArea onChange={this.onChangeNotes} label="Description" placeholder="Please give a short description of the resource or your project..." />
                        </Form.Field>
                        <Button textAlign="center" animated type='submit' color="green" onClick={this.onSubmit}>
                        <Button.Content visible>
                            Submit
                        </Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                        </Button>
                        
                        </div>
                        : <div>
                        <Form.Field>
                            <label>Project Title</label>
                            <input onChange={this.onChangeProTitle}/>
                        </Form.Field> 
                        <Form.Field>
                            <label>Your Mentor</label>
                            <input onChange={this.onChangeMentor} />
                        </Form.Field>
                        <Form.Field>
                            <label>Technologies you've used</label>
                            <input onChange={this.onChangeTechnologies} />
                        </Form.Field>
                        <Form.Field className="res-form-category">
                            <label>Category</label>
                            <input onChange={this.onChangeCategory} placeholder="Web Development,Intern Project..."/>
                        </Form.Field>
                        <Form.Field>
                            <label>Tags</label>
                            <input onChange={this.onChangeTags} placeholder="Please put ',' after each tag." />
                        </Form.Field>
                        <Form.Field>
                            <Form.TextArea onChange={this.onChangeNotes} label="Description" placeholder="Please give a short description of the resource or your project..." />
                        </Form.Field>
                        <Button textAlign="center" animated type='submit' color="green" onClick={this.onSubmit}>
                        <Button.Content visible>
                            Submit
                        </Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                    </Button>
                        </div>
                        }
                

                    </Form>
                </Container>
            </div>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        userMail: state.preLoginReducers.userMail,
        userName: state.preLoginReducers.userName,
        resType: state.postLoginReducers.resType
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(postLoginActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddResourceForm)