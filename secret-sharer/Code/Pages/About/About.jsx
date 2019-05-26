import React from "react"

export default class About extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        let buttons = document.querySelectorAll('.fixed-action-btn')
        let selectors = document.querySelectorAll('select')

        M.FloatingActionButton.init(buttons, {})
        M.FormSelect.init(selectors, {})
        MathJax.Hub.Typeset()
    }

    render () {
        return (
            <React.Fragment>
                <div className="row" style={{display: "grid", gridTemplateColumns: "5% 90% 5%"}}>
                    <div ></div>
                    <div className="col s12 m10 l8 offset-m1 offset-l2">
                        
                        <h3>Shamir Secret Sharing</h3>

                        <div className="row">
                            <h4>The problem ...</h4>
                            <p>
                                Suppose that a group of \(n\) people is working on a confidential project,
                                (for simplicity assume it's a file) and all of they but only they always want
                                to access to that file.
                            </p>
                            <p>
                                One possible solution is to encrypt the file using any block cipher (such as AES)
                                and give the key to only one designed person. With this we guarantee a high
                                level of confidentiality because nobody else has the key, but the disponibility
                                will decrease because if that person is unavailable, it will be impossible to
                                recover the file again.
                            </p>
                            <p>
                                Other possible solution is to create \(k \leq n\) identical copies of the key and distribute
                                them among \(k\) designed persons. Now we have more disponibility because if one
                                person is not available, there may be other that is available. But if the number
                                of people that has the key increases, we will have less confidentiality because the
                                probability that one of those keys arrives to an authorized person also increases,
                                compromising the original file.
                            </p>
                        </div>

                        <div className="row">
                            <h4>The solution...</h4>
                            <p>
                                We will define a technique called <i>Secret sharing</i>, in which we distribute a <i>secret</i> (in
                                this case the key used in AES) amongst a group of \(n\) persons, each of whom will receive
                                a <i>share</i> of the secret. This secret can be recovered only when a sufficient
                                number of shares are combined together.
                            </p>
                            <p>
                                In this webapp we will use the \((k, n)\)-threshold scheme in which a share is given to all \(n\)
                                people, such that any group of \(k\) or more people can together reconstruct the secret but
                                no group of fewer than \(k\) people can, meaning that the won't know <b>anything</b> about
                                the key.
                            </p>
                            <p>
                                Any implementation of this scheme must have information theoretic security, which implies that:
                                <ul className="browser-default">
                                    <li>
                                        The length of every share must be greater than or equal than the secret, i.e., given
                                        \(k'\) shares, where \({`k < k'`}\), we won't have any information about the key (in
                                        the sense that all the possible keys are equiprobable). That means that every share
                                        must contain as much information as the original secret.
                                    </li>
                                    <li>
                                        The previous point implies that to make shares for a secret of length \(b\) bits, we
                                        will need \(b(k-1)\) random bits.
                                    </li>
                                </ul>
                            </p>
                        </div>

                        <div className="row">
                            <h4>Trivial cases</h4>
                            <p>
                                Let \(K\) be the secret.
                                There are some cases in which is easy to implement the \((k, n)\)-threshold scheme:
                                <ul className="browser-default">
                                    <li>
                                        When \(k=1\), we just need to distribute the secret to all the \(n\) persons.
                                    </li>
                                    <li>
                                        When \(k=n\), we give to the \({`i^{th}`}\) person (\({`i \\leq i \\leq n-1`}\))
                                        a randomly generated share \(K_i\) with the same length of the secret.
                                        Finally, we give to the last person (the \({`n^{th}`}\) one) the value of \(K_n\),
                                        given by \({`K_n = K \\oplus K_1 \\oplus K_2 \\oplus \\cdots \\ \\oplus K_{n-1}`}\).
                                        Finally, the secret \(K\) can be recovered by doing \({`K = K_1 \\oplus K_2 \\oplus \\cdots \\ \\oplus K_n`}\),
                                        and it's easy to see that a group of less than \(n\) people won't know anything
                                        about the secret.
                                    </li>
                                </ul>
                            </p>
                        </div>

                        <div className="row">
                            <h4>Shamir scheme</h4>
                            <p>
                                This works for any \(k\) such that \({`1 \\leq k \\leq n`}\). The first step is to
                                represent the secret \(K\) as an element of a finite field.
                            </p>
                            <p>
                                Let \({`P(x) = a_0 + a_1x + a_2x^2 + \\cdots + a_{k-1}x^{k-1}`}\) be a \(k-1\)
                                degree polynomial where all the \(k\) coefficients belong to the same finite field than the
                                secret \(K\). Let the constant term be equal to the secret, i.e., \(K=a_0\).
                            </p>
                            <p>
                                Then, choose at random the values of \({`a_1, a_2, \\ldots, a_{k-1}`}\).
                            </p>
                            <p>
                                Evaluate \(P(x)\) at \(n\) distinct points. By simplicity, evaluate it at 
                                \({`x=1, 2, \\ldots, n`}\). Finally, give to the \({`i^{th}`}\) person the point
                                \({`(i, P(i))`}\), that will be the share for that person. Notice that we
                                shouldn't evaluate \(P(x)\) at \(x=0\), because that will reveal the secret.
                            </p>
                            <p>
                                Now, for every group of \({`k' \\geq k`}\) persons, we can reconstruct uniquely the
                                polynomial \(P(x)\) using Lagrange Interpolation, and then find the secret, saved in \(P(0)\).
                                Since we don't care about the other coefficients, we can find directly \(P(0)\).
                            </p>
                            <p>
                                And if any group of \({`k' < k`}\) persons try to recover the secret, the polynomial
                                that they will obtaion will be of degree of at most \(k-2\), which doesn't have enough
                                information to correctly determine \(P(x)\), so the value of \(P(0)\) will also be
                                incorrect, and it can be <i>any</i> value of the finite field used, so the won't
                                know anything about the secret.
                            </p>
                        </div>
                    </div>
                    <div ></div>
                </div>
            </React.Fragment>
        )
    }

}