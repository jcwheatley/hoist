import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Dropdown({ label, options, selected, setSelected }) {
  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-bold text-white mb-1'>
          {label}
        </label>
      )}
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative'>
          <ListboxButton className='w-full bg-[#19202D] text-white border border-gray-600 rounded-lg py-3 px-4 text-left flex justify-between items-center'>
            {selected
              ? options?.find((o) => o.value === selected)?.label
              : "Select"}
            <FontAwesomeIcon icon={faChevronDown} className='ml-2 text-sm' />
          </ListboxButton>
          <ListboxOptions className='absolute mt-1 w-full bg-[#1F2937] border border-gray-700 rounded-lg shadow-lg z-10 list-none'>
            {options?.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                {({ active, selected }) => (
                  <li
                    className={`px-4 py-2 cursor-pointer ${
                      active ? "bg-gray-700 text-white" : "text-gray-300"
                    } ${selected ? "font-semibold" : ""}`}
                  >
                    {option.label}
                  </li>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
