import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'preact';
import { getNewDocument } from '../lib/get-new-document';
import { getRxJsExample } from '../lib/get-rx-js-example';
import { EditorApp } from '../types';

interface Props {
  setState: EditorApp.SetState;
  state: EditorApp.State;
}

export function DocumentMenu({ setState, state }: Props) {
  const items = [
    {
      name: 'Empty Document',
      onClick() {
        setState((next) => {
          next.doc = getNewDocument();
        });
      },
    },
    {
      name: 'RxJS Operator Decision Tree',
      onClick() {
        setState((next) => {
          next.doc = getRxJsExample();
        });
      },
    },
  ];

  return (
    <div className="relative z-0 inline-flex shadow-sm rounded-md">
      <Menu as="div" className="-ml-px relative block">
        <Menu.Button className="relative inline-flex items-center px-2 py-2 pl-4 rounded-md border border-gray-900 bg-slate-800 text-sm font-medium text-white focus:z-10">
          Open Document
          <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {items.map((item) => (
                <Menu.Item key={item.name}>
                  {() => (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="w-full block px-4 py-2 text-sm text-left"
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
