import { useState } from 'react'
import { Answer } from '../../interfaces/Answer'


function AnswerCards ({ update: updateAnswers, initialAnswers }: { update: any, initialAnswers: Answer[] }) {
  const [answers, setAnswers] = useState(initialAnswers)

    const toggler = (index: number) => {
        const updatedAnswerCards = answers.map((answer, idx) => {
            if (idx === index) {
            
                answer.isCorrect = !answer.isCorrect
            }
            return answer
        });

    setAnswers(updatedAnswerCards)
    updateAnswers(updatedAnswerCards)
    
  }
  const handleAnswerCardAdd = () => {

    const withAddedAnswer = answers.concat({text: "", isCorrect: false, feedback: ""});

    setAnswers(withAddedAnswer);
    updateAnswers(withAddedAnswer);
}

  const handleAnswerCardDelete = (index: any) => {
    try {
      if (index < 2) {
        throw Error('Deletion not allowed. An exercise needs at least 2 answers')
      }

      const withOneLessAnswer = [...answers]
      withOneLessAnswer.splice(index, 1)
      setAnswers(withOneLessAnswer)
      updateAnswers(withOneLessAnswer)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAnswerCardChange = (e: any, index: number) => {
        const { value } = e.target;

        const list = [...answers];
        list[index].text = value;

        setAnswers(list);
        updateAnswers(list);
    }
  return (
     
        <div className="">
            {answers.map((answer, index) => (
                <div key={index} className="card w-full bg-base-100 border hover:shadow-xl">
                    <div className="card-body">

                    <div className="flex items-center gap-8 w-full  items-baseline">

                        <div className="form-control w-1/10 card-actions flex justify-around ">

                            <button onClick={() => { handleAnswerCardDelete(index) }} className="btn btn-square btn-sm absolute top-2 right-2  ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                </svg>
                            </button>
                        </div>

                        <div className='flex flex-col space-y-2 text-left'>
                            <p>A resposta é {answer.isCorrect ? <span> Correta</span> : <span> Incorreta</span>}</p>
                            <div className="form-control w-1/10">
                                {/*Toggle True or False  */}
                                <input type="checkbox" className="toggle" checked={answer.isCorrect} onChange={() => toggler(index)} />
                               
                            </div>
                        </div>
                        
                        <div className='flex flex-col space-y-2 text-left' >
                            <p>Responder</p> {/** Answer */}
                            <textarea className="form-control w-1/10 textarea textarea-success disabled:bg-white disabled:border-white h-8 resize-none"
                                placeholder="Some answer text"
                                required={true}
                                name="answer"
                                defaultValue={answer.text || ""}
                                onChange={(e) => handleAnswerCardChange(e, index)}
                            >
                            </textarea>
                        </div>

                        <div className='flex flex-col space-y-2 text-left'>
                            <p>Opinião</p> {/** Feedback */}
                            <textarea className="form-control w-1/10 textarea textarea-success disabled:bg-white disabled:border-white h-8 resize-none"
                                placeholder="Some answer text"
                                required={true}
                                name="feedback"
                                defaultValue={answer.feedback || ""}
                                
                            >
                            </textarea>
                        </div>
                        

                        </div>

                    </div>
                </div>
            ))}

            {answers.length < 4 &&
                <div key={-1} onClick={handleAnswerCardAdd} className="card w-64 h-64 bg-none border border-dashed border-4 hover:shadow-xl">
                    <div className="card-body">
                        <div className="card-actions flex justify-around items-center h-full">
                            <div className="flex flex-row space-x-4" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Answer
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    
        
        
  )
}

export default AnswerCards
