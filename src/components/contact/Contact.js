import React from 'react'
import { BiPhoneCall } from 'react-icons/bi'
import { AiOutlineMail } from 'react-icons/ai'
import { GoLocation } from 'react-icons/go'
import { BiSend } from 'react-icons/bi'

const Contact = () => {
    return (
        <section className="contact section" id="contact">
            <h2 className="section_title">Contact Me</h2>
            <span className="section_subtitle">Get in touch</span>

            <div className="contact_container container grid">
                <div>
                    <div className="contact_information">
                        <BiPhoneCall className="contact_icon"/>

                        <div>
                            <h3 className="contact_title">Call Me</h3>
                            <span className="contact_subtitle">254-729-097-858</span>
                        </div>
                    </div>
                    <div className="contact_information">
                        <AiOutlineMail className="contact_icon"/>

                        <div>
                            <h3 className="contact_title">Email</h3>
                            <span className="contact_subtitle">ahawoadeya995@gmail.com</span>
                        </div>
                    </div>
                    <div className="contact_information">
                        <GoLocation className="contact_icon"/>

                        <div>
                            <h3 className="contact_title">Location</h3>
                            <span className="contact_subtitle">Nairobi - Kenya</span>
                        </div>
                    </div>
                </div>

                <form action="" className="contact_form grid">
                    <div className="contact_inputs grid">
                        <div className="contact_content">
                            <label htmlFor="" className="contact_label">Name</label>
                            <input required type="text" className="contact_input" />
                        </div>
                        <div className="contact_content">
                            <label htmlFor="" className="contact_label">Email</label>
                            <input required type="email" className="contact_input" />
                        </div>
                    </div>
                    <div className="contact_content">
                        <label htmlFor="" className="contact_label">Project</label>
                        <input required type="text" className="contact_input" />
                    </div>
                    <div className="contact_content">
                        <label htmlFor="" className="contact_label">Message</label>
                        <textarea required name="" id="" cols="0" rows="7" className="contact_input"></textarea>
                    </div>
                    <div>
                        <a href="#contact" type="submit" className="button button--flex">
                            Send Message
                            <BiSend className="button_icon"/>
                        </a>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Contact