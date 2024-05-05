import Search from '../icons/Search';
import SearchSelectForm from './SearchSelectForm';


const SearchForm: React.FC = () => {
    return (
        <form className="w-[60vw] h-16 mx-auto mt-12">   
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative ">
                <div className="absolute inset-y-0 end-4  flex items-center justify-center hover:cursor-pointer">
                    <Search/>
                </div>
                <div className="absolute inset-y-0 end-20  flex items-center justify-center pe-1 hover:cursor-pointer">
                    <SearchSelectForm/>
                </div>
                <p className="absolute inset-y-0 start-4 text-black  flex items-center justify-center ">
                    What  {'   '}
                </p>
                <input type="search" id="default-search" className="block w-full p-4 ps-16 text-sm text-gray-500 border-0
                 rounded-3xl py-8 flex aligh-center justify-center pr-[25vw]" placeholder=" Search Activities..." required />
                
            </div>
        </form>
    );
}

export default SearchForm;
