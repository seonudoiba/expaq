import ActivityType from '../common/ActivityType'

const ActivityTypes = () => {
    const activityTypes = ["hiking","Yoga",
    'Cooking ',
    'Painting',
    'Photography',
    'Language ',
    'Cycling ',
    'DIY craft'
    // 'Fitness boot camps',
    // 'Meditation retreats'
]
    return (
        <div className='flex items-center justify-center '>
            <div className="category  bg-white w-[90vw] absolute h-[12rem] rounded-lg flex items-center justify-center">
                {activityTypes.map((activityType,key) =>(
                        <ActivityType key ={key} type={activityType}/>
                    )
                )
            }
                
            </div>
        </div>
    )
}

export default ActivityTypes