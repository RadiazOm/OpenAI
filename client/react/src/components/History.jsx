import boberPfp from '../assets/bober-kurwa.png'
import defaultPfp from '../assets/Default_pfp.png'

function History(props) {

    if (props.messenger === 'human') {
        return (
            <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                <div>
                    <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                        <p className="text-sm">{props.message}</p>
                    </div>
                </div>
                <img className="flex-shrink-0 h-10 w-10 rounded-full bg-white"  src={defaultPfp} alt=""/>
            </div>
        )
    }

    if (props.messenger === 'ai') {
        return (
            <div className="flex w-full mt-2 space-x-3 max-w-xs">
                <img className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"  src={boberPfp} alt=""/>
                <div>
                    <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                        <p className="text-sm">{props.message}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default History