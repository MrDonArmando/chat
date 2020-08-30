import React, {
  Component,
  createRef,
  RefObject,
  MutableRefObject,
} from "react";
import "./index.scss";
import { RootState } from "../../../../redux/store";
import firebase from "../../../../global_components/firebase";
import { connect } from "react-redux";
import {
  fetchLast20Messages,
  fetch10PreviousMessages,
} from "../../../../redux/chat/actions";
import { Message } from "../../../../redux/chat/interfaces";
import { RouteProps } from "react-router";
import Spinner from "../Spinner";

interface Props {
  fetchLast20Messages: Function;
  fetch10PreviousMessages: Function;
  messages: Message[];
  isFetching20LastMessages: boolean;
  isFetching10PreviousMessages: boolean;
  friendID: string;
}

class Messages extends Component<Props & RouteProps> {
  private currentUserID: string;
  private intersectionObserverRef: MutableRefObject<IntersectionObserver | null>;
  private firstMessageRef: HTMLElement | null;
  private messagesContainerRef: RefObject<HTMLDivElement>;
  private setFirstMessageRef: (node: any) => void;
  //private observeFirstMessage: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.currentUserID = firebase.getMyUID();

    this.intersectionObserverRef = createRef();
    this.firstMessageRef = null;
    this.messagesContainerRef = createRef();
    this.setFirstMessageRef = (node) => {
      //callback ref
      this.firstMessageRef = node;
    };
  }

  componentDidMount() {
    this.observeFirstMessage();
    this.props.fetchLast20Messages(this.props.friendID);
  }

  getSnapshotBeforeUpdate(prevProps: Props) {
    if (
      prevProps.messages.length < this.props.messages.length &&
      this.messagesContainerRef.current
    ) {
      return (
        this.messagesContainerRef.current.scrollHeight -
        this.messagesContainerRef.current.scrollTop
      );
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, _: any, snapshot: number) {
    if (prevProps.friendID !== this.props.friendID)
      this.props.fetchLast20Messages(this.props.friendID);

    if (prevProps.messages !== this.props.messages) this.observeFirstMessage();

    if (snapshot !== null && this.messagesContainerRef.current) {
      this.messagesContainerRef.current.scrollTop =
        this.messagesContainerRef.current.scrollHeight - snapshot;
    }
  }

  observeFirstMessage = () => {
    if (this.intersectionObserverRef.current) {
      this.intersectionObserverRef.current.disconnect();
    }

    this.intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.props.fetch10PreviousMessages();
        }
      }
    );

    if (this.firstMessageRef && this.intersectionObserverRef.current)
      this.intersectionObserverRef.current.observe(this.firstMessageRef);
  };

  render() {
    if (this.props.isFetching10PreviousMessages) {
      console.log("FETCHING");
    }
    return (
      <div id="messages-container" ref={this.messagesContainerRef}>
        <div className="spinner-container">
          {this.props.isFetching10PreviousMessages ? (
            <Spinner />
          ) : (
            <span className="no-more-messages">
              These are all messages in this conversation
            </span>
          )}
        </div>

        {this.props.isFetching20LastMessages ? (
          <Spinner />
        ) : (
          this.props.messages.map(({ id, text, from }, index) => {
            const isFirstMessage = index === 0;

            return (
              <div
                key={id}
                {...(isFirstMessage ? { ref: this.setFirstMessageRef } : {})}
                className={`message-wrapper ${
                  this.currentUserID === from
                    ? "message-wrapper--position-right"
                    : "message-wrapper--position-left"
                }`}
              >
                <span className="message">{text}</span>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  messages: state.chat.messages,
  isFetching20LastMessages: state.chat.isFetching20LastMessages,
  isFetching10PreviousMessages: state.chat.isFetching10PreviousMessages,
});

const mapDispatchToProps = { fetch10PreviousMessages, fetchLast20Messages };

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
