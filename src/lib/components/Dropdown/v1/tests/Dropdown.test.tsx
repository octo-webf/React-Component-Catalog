import React, { useEffect } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dropdown from '../Dropdown'
import Menu, { LabelProps } from '../Menu'

function renderWithStyle(ui: React.ReactElement, ...args: unknown[]) {
  return render(
    <>
      <style>{'.closed { display: none; }'}</style>
      {ui}
    </>,
    ...args,
  )
}

const onClick = jest.fn()

describe('Dropdown tests', () => {
  function openSubmenu(menu: HTMLElement, firstItem?: HTMLElement): void {
    menu.focus()
    expect(menu).toHaveFocus()
    userEvent.keyboard('{ArrowDown}')
    if (firstItem != null) {
      expect(firstItem).toBeVisible()
      expect(firstItem).toHaveFocus()
    }
  }
  it('should trigger onClick when button clicked', () => {
    renderWithStyle(
      <Dropdown aria-label="My Menu">
        <button type="button" onClick={onClick}>Link</button>
      </Dropdown>,
    )
    userEvent.click(screen.getByText('Link'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
  it('should hide all submenus', () => {
    renderWithStyle(
      <Dropdown aria-label="My Menu">
        <Menu label="Menu">
          <button type="button">Link</button>
        </Menu>
      </Dropdown>,
    )
    expect(screen.getByText('Link')).not.toBeVisible()
  })
  it('should open menus when hovering', () => {
    renderWithStyle(
      <Dropdown aria-label="My Menu">
        <Menu label="Menu">
          <button type="button">Link</button>
        </Menu>
      </Dropdown>,
    )
    userEvent.hover(screen.getByText('Menu'))
    expect(screen.getByText('Link')).toBeVisible()
  })
  it('should open any number of submenu when hovering', () => {
    renderWithStyle(
      <Dropdown aria-label="My Menu">
        <Menu label="Menu">
          <Menu label="Submenu">
            <button type="button">Link</button>
          </Menu>
        </Menu>
      </Dropdown>,
    )
    const menu = screen.getByText('Menu')
    const submenu = screen.getByText('Submenu')
    const link = screen.getByText('Link')
    expect(submenu).not.toBeVisible()
    expect(link).not.toBeVisible()
    userEvent.hover(menu)
    expect(link).not.toBeVisible()
    userEvent.hover(submenu)
    expect(link).toBeVisible()
  })
  it('should support custom buttons as ReactElement', () => {
    const CustomButton = React.forwardRef<HTMLButtonElement>((props, ref) => (
      <button ref={ref} type="button" onClick={onClick}>Hello</button>
    ))
    renderWithStyle(
      <Dropdown aria-label="My Menu">
        <CustomButton />
      </Dropdown>,
    )
    userEvent.click(screen.getByText('Hello'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
  it('should support custom buttons as render prop for menu labels', () => {
    const CustomButton = React.forwardRef<HTMLButtonElement>((props, ref) => (
      <button ref={ref} type="button" onClick={onClick}>Hello</button>
    ))
    renderWithStyle(
      <Dropdown aria-label="My Menu">
        <Menu label={(props: LabelProps<HTMLButtonElement>) => <CustomButton {...props} />}>
          <button type="button">Link</button>
        </Menu>
      </Dropdown>,
    )
    userEvent.click(screen.getByText('Hello'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
  it('should not refocus the menubar when closing a menu by unhovering', async () => {
    const effect = jest.fn()
    function EffectComponent(): React.ReactElement {
      useEffect(effect)
      return null
    }
    renderWithStyle(
      <>
        <button type="button">Focus</button>
        <Dropdown aria-label="My Menu">
          <Menu label="Menu">
            <button type="button">Link</button>
          </Menu>
        </Dropdown>
        <EffectComponent />
      </>,
    )
    const focus = screen.getByText('Focus')
    const menu = screen.getByText('Menu')
    focus.focus()
    expect(menu).not.toHaveFocus()
    userEvent.hover(menu)
    expect(menu).not.toHaveFocus()
    userEvent.unhover(menu)
    // Wait for effect to finish
    // should not race the focus since focus is a layout effect => called before effects
    // also since rendered last, should call its effects after other components
    await waitFor(() => expect(effect).toHaveBeenCalled())
    expect(menu).not.toHaveFocus()
    expect(focus).toHaveFocus()
  })
  it('should not focus the menu at mount', () => {
    renderWithStyle(
      <Dropdown aria-label="My Menu">
        <button type="button">Link</button>
      </Dropdown>,
    )
    const menu = screen.getByText('Link')
    expect(menu).not.toHaveFocus()
  })
  it('should close all submenus when loosing focus', () => {
    renderWithStyle(
      <>
        <button type="button">focus</button>
        <Dropdown aria-label="My Menu">
          <Menu label="Submenu 1">
            <Menu label="Submenu 2">
              <button type="button">Link</button>
            </Menu>
          </Menu>
        </Dropdown>
      </>,
    )
    const submenu1 = screen.getByText('Submenu 1')
    const submenu2 = screen.getByText('Submenu 2')
    const link = screen.getByText('Link')
    const focus = screen.getByText('focus')
    openSubmenu(submenu1)
    userEvent.keyboard('{ArrowRight}')
    expect(link).toBeVisible()
    focus.focus()
    expect(link).not.toBeVisible()
    expect(submenu2).not.toBeVisible()
    expect(focus).toHaveFocus()
  })

  describe('Keyboard tests', () => {
    describe('Menubar tests', () => {
      it('should trigger onClick when pressing Space on a link', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <button type="button" onClick={onClick}>Link</button>
          </Dropdown>,
        )
        const link = screen.getByText('Link')
        link.focus()
        expect(link).toHaveFocus()
        userEvent.keyboard('{space}')
        expect(onClick).toHaveBeenCalledTimes(1)
      })
      it('should trigger onClick when pressing Enter on a link', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <button type="button" onClick={onClick}>Link</button>
          </Dropdown>,
        )
        const link = screen.getByText('Link')
        link.focus()
        expect(link).toHaveFocus()
        userEvent.keyboard('{Enter}')
        expect(onClick).toHaveBeenCalledTimes(1)
      })
      describe('Focus moving tests', () => {
        it('should move the focus to the next item when pressing Right Arrow', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <button type="button">Link 1</button>
              <button type="button">Link 2</button>
            </Dropdown>,
          )
          const firstItem = screen.getByText('Link 1')
          const nextItem = screen.getByText('Link 2')
          firstItem.focus()
          expect(firstItem).toHaveFocus()
          userEvent.keyboard('{ArrowRight}')
          expect(nextItem).toHaveFocus()
        })
        it('should move the focus to the previous item when pressing Left Arrow', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <button type="button">Link 1</button>
              <button type="button">Link 2</button>
            </Dropdown>,
          )
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 2')
          firstItem.focus()
          expect(firstItem).toHaveFocus()
          userEvent.keyboard('{End}')
          expect(lastItem).toHaveFocus()
          userEvent.keyboard('{ArrowLeft}')
          expect(firstItem).toHaveFocus()
        })
        it('should move the focus to the first item when pressing Right Arrow and focussing the last item', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <button type="button">Link 1</button>
              <button type="button">Link 2</button>
              <button type="button">Link 3</button>
            </Dropdown>,
          )
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 3')
          firstItem.focus()
          expect(firstItem).toHaveFocus()
          userEvent.keyboard('{End}')
          expect(lastItem).toHaveFocus()
          userEvent.keyboard('{ArrowRight}')
          expect(firstItem).toHaveFocus()
        })
        it('should move the focus to the last item when pressing Left Arrow and focussing the first item', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <button type="button">Link 1</button>
              <button type="button">Link 2</button>
              <button type="button">Link 3</button>
            </Dropdown>,
          )
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 3')
          firstItem.focus()
          expect(firstItem).toHaveFocus()
          userEvent.keyboard('{ArrowLeft}')
          expect(lastItem).toHaveFocus()
        })
        it('should focus the first item when pressing Home', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <button type="button">Link 1</button>
              <button type="button">Link 2</button>
              <button type="button">Link 3</button>
            </Dropdown>,
          )
          const firstItem = screen.getByText('Link 1')
          const nextItem = screen.getByText('Link 2')
          firstItem.focus()
          expect(firstItem).toHaveFocus()
          userEvent.keyboard('{ArrowRight}')
          expect(nextItem).toHaveFocus()
          userEvent.keyboard('{Home}')
          expect(firstItem).toHaveFocus()
        })
        it('should focus the last item when pressing End', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <button type="button">Link 1</button>
              <button type="button">Link 2</button>
              <button type="button">Link 3</button>
            </Dropdown>,
          )
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 3')
          firstItem.focus()
          expect(firstItem).toHaveFocus()
          userEvent.keyboard('{End}')
          expect(lastItem).toHaveFocus()
        })
        describe('Character matching tests', () => {
          it('should focus the next item starting with the character when pressing a character', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <button type="button">a--</button>
                <button type="button">b--</button>
                <button type="button">c--</button>
              </Dropdown>,
            )
            const firstItem = screen.getByText('a--')
            const matchingItem = screen.getByText('b--')
            firstItem.focus()
            expect(firstItem).toHaveFocus()
            userEvent.keyboard('{b}')
            expect(matchingItem).toHaveFocus()
          })
          it('should loop on the items when no matching item after current item when pressing a character', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <button type="button">a--</button>
                <button type="button">b--</button>
                <button type="button">c--</button>
              </Dropdown>,
            )
            const firstItem = screen.getByText('a--')
            const nextItem = screen.getByText('b--')
            firstItem.focus()
            expect(firstItem).toHaveFocus()
            userEvent.keyboard('{ArrowRight}')
            expect(nextItem).toHaveFocus()
            userEvent.keyboard('{a}')
            expect(firstItem).toHaveFocus()
          })
          it('should not move the focus when no matching item when pressing a character', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <button type="button">a--</button>
                <button type="button">b--</button>
                <button type="button">c--</button>
              </Dropdown>,
            )
            const firstItem = screen.getByText('a--')
            firstItem.focus()
            expect(firstItem).toHaveFocus()
            userEvent.keyboard('{z}')
            expect(firstItem).toHaveFocus()
          })
          it('should move focus to the next matching item when current item also match the character when pressing a character', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <button type="button">a--</button>
                <button type="button">a--2</button>
                <button type="button">a--3</button>
              </Dropdown>,
            )
            const firstItem = screen.getByText('a--')
            const nextMatchingItem = screen.getByText('a--2')
            firstItem.focus()
            expect(firstItem).toHaveFocus()
            userEvent.keyboard('{a}')
            expect(nextMatchingItem).toHaveFocus()
          })
          it('should ignore the case', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <button type="button">A--</button>
                <button type="button">B--</button>
                <button type="button">C--</button>
              </Dropdown>,
            )
            const firstItem = screen.getByText('A--')
            const matchingItem = screen.getByText('B--')
            firstItem.focus()
            expect(firstItem).toHaveFocus()
            userEvent.keyboard('{b}')
            expect(matchingItem).toHaveFocus()
          })
        })
      })
    })
    describe('Submenu tests', () => {
      it('should trigger onClick when pressing Space on a link in a submenu', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <Menu label="Menu">
              <button type="button" onClick={onClick}>Link</button>
            </Menu>
          </Dropdown>,
        )
        const menu = screen.getByText('Menu')
        const link = screen.getByText('Link')
        openSubmenu(menu, link)
        userEvent.keyboard('{space}')
        expect(onClick).toHaveBeenCalledTimes(1)
      })
      it('should trigger onClick when pressing Enter on a link in a submenu', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <Menu label="Menu">
              <button type="button" onClick={onClick}>Link</button>
            </Menu>
          </Dropdown>,
        )
        const menu = screen.getByText('Menu')
        const link = screen.getByText('Link')
        openSubmenu(menu, link)
        userEvent.keyboard('{Enter}')
        expect(onClick).toHaveBeenCalledTimes(1)
      })
      describe('Focus moving tests', () => {
        it('should open the submenu and focus the first item when pressing Space on the label', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link')
          menu.focus()
          expect(menu).toHaveFocus()
          userEvent.keyboard('{space}')
          expect(firstItem).toBeVisible()
          expect(firstItem).toHaveFocus()
        })
        it('should open the submenu and focus the first item when pressing Enter on the label', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link')
          menu.focus()
          expect(menu).toHaveFocus()
          userEvent.keyboard('{Enter}')
          expect(firstItem).toBeVisible()
          expect(firstItem).toHaveFocus()
        })
        it('should open the submenu and focus the first item when pressing Down Arrow on the label', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')
          menu.focus()
          expect(menu).toHaveFocus()
          userEvent.keyboard('{ArrowDown}')
          expect(firstItem).toBeVisible()
          expect(firstItem).toHaveFocus()
        })
        it('should open the submenu and focus the last item when pressing Up Arrow on the label', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const lastItem = screen.getByText('Link 3')
          menu.focus()
          expect(menu).toHaveFocus()
          userEvent.keyboard('{ArrowUp}')
          expect(lastItem).toBeVisible()
          expect(lastItem).toHaveFocus()
        })
        it('should move focus to the next item when pressing Down Arrow in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')
          const nextItem = screen.getByText('Link 2')

          openSubmenu(menu, firstItem)
          userEvent.keyboard('{ArrowDown}')
          expect(nextItem).toHaveFocus()
        })
        it('should move focus to the previous item when pressing Up Arrow in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')
          const nextItem = screen.getByText('Link 2')

          openSubmenu(menu, firstItem)

          // move past first item
          userEvent.keyboard('{ArrowDown}')
          expect(nextItem).toHaveFocus()

          // move back to first item
          userEvent.keyboard('{ArrowUp}')
          expect(firstItem).toHaveFocus()
        })
        it('should move the focus to the first item when pressing Down Arrow and focussing the last item in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 3')

          openSubmenu(menu, firstItem)

          // move to last item
          userEvent.keyboard('{End}')
          expect(lastItem).toHaveFocus()

          // move back to first item
          userEvent.keyboard('{ArrowDown}')
          expect(firstItem).toHaveFocus()
        })
        it('should move the focus to the last item when pressing Up Arrow and focussing the first item in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 3')

          openSubmenu(menu, firstItem)
          userEvent.keyboard('{ArrowUp}')
          expect(lastItem).toHaveFocus()
        })
        it('should move the focus to the first item when pressing Home in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 3')

          openSubmenu(menu, firstItem)

          // move to last item
          userEvent.keyboard('{End}')
          expect(lastItem).toHaveFocus()

          // move back to first item
          userEvent.keyboard('{Home}')
          expect(firstItem).toHaveFocus()
        })
        it('should move the focus to the last item when pressing End in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')
          const lastItem = screen.getByText('Link 3')

          openSubmenu(menu, firstItem)
          userEvent.keyboard('{End}')
          expect(lastItem).toHaveFocus()
        })
        it('should close the submenu and focus the label when pressing Escape in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <button type="button">Link 1</button>
                <button type="button">Link 2</button>
                <button type="button">Link 3</button>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const firstItem = screen.getByText('Link 1')

          openSubmenu(menu, firstItem)
          userEvent.keyboard('{Escape}')
          expect(firstItem).not.toBeVisible()
          expect(menu).toHaveFocus()
        })
        describe('Character matching tests', () => {
          it('should focus the next item starting with the character when pressing a character in a submenu', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <Menu label="Menu">
                  <button type="button">a--</button>
                  <button type="button">b--</button>
                  <button type="button">c--</button>
                </Menu>
              </Dropdown>,
            )
            const menu = screen.getByText('Menu')
            const firstItem = screen.getByText('a--')
            const matchingItem = screen.getByText('b--')

            openSubmenu(menu, firstItem)

            userEvent.keyboard('{b}')
            expect(matchingItem).toHaveFocus()
          })
          it('should loop on the items when no matching item after current item when pressing a character in a submenu', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <Menu label="Menu">
                  <button type="button">a--</button>
                  <button type="button">b--</button>
                  <button type="button">c--</button>
                </Menu>
              </Dropdown>,
            )
            const menu = screen.getByText('Menu')
            const firstItem = screen.getByText('a--')
            const nextItem = screen.getByText('b--')

            openSubmenu(menu, firstItem)

            userEvent.keyboard('{ArrowDown}')
            expect(nextItem).toHaveFocus()
            userEvent.keyboard('{a}')
            expect(firstItem).toHaveFocus()
          })
          it('should not move the focus when no matching item when pressing a character in a submenu', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <Menu label="Menu">
                  <button type="button">a--</button>
                  <button type="button">b--</button>
                  <button type="button">c--</button>
                </Menu>
              </Dropdown>,
            )
            const menu = screen.getByText('Menu')
            const firstItem = screen.getByText('a--')

            openSubmenu(menu, firstItem)

            userEvent.keyboard('{z}')
            expect(firstItem).toHaveFocus()
          })
          it('should move focus to the next matching item when current item also match the character when pressing a character in a submenu', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <Menu label="Menu">
                  <button type="button">a--</button>
                  <button type="button">a--2</button>
                  <button type="button">a--3</button>
                </Menu>
              </Dropdown>,
            )
            const menu = screen.getByText('Menu')
            const firstItem = screen.getByText('a--')
            const nextMatchingItem = screen.getByText('a--2')

            openSubmenu(menu, firstItem)

            userEvent.keyboard('{a}')
            expect(nextMatchingItem).toHaveFocus()
          })
          it('should ignore the case', () => {
            renderWithStyle(
              <Dropdown aria-label="My Menu">
                <Menu label="Menu">
                  <button type="button">A--</button>
                  <button type="button">B--</button>
                  <button type="button">C--</button>
                </Menu>
              </Dropdown>,
            )
            const menu = screen.getByText('Menu')
            openSubmenu(menu)
            const firstItem = screen.getByText('A--')
            const matchingItem = screen.getByText('B--')
            firstItem.focus()
            expect(firstItem).toHaveFocus()
            userEvent.keyboard('{b}')
            expect(matchingItem).toHaveFocus()
          })
        })
      })
      describe('Submenu nesting tests', () => {
        it('should open the submenu and focus the first item when pressing Right Arrow on the label in a submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <Menu label="Nested Menu">
                  <button type="button">Link</button>
                </Menu>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const nestedMenu = screen.getByText('Nested Menu')
          const firstItem = screen.getByText('Link')

          openSubmenu(menu, nestedMenu)

          userEvent.keyboard('{ArrowRight}')
          expect(firstItem).toBeVisible()
          expect(firstItem).toHaveFocus()
        })
        it('should close the submenu and move focus to the label when pressing Left Arrow in a submenu\'s submenu', () => {
          renderWithStyle(
            <Dropdown aria-label="My Menu">
              <Menu label="Menu">
                <Menu label="Nested Menu">
                  <button type="button">Link</button>
                </Menu>
              </Menu>
            </Dropdown>,
          )
          const menu = screen.getByText('Menu')
          const nestedMenu = screen.getByText('Nested Menu')
          const firstItem = screen.getByText('Link')

          openSubmenu(menu, nestedMenu)

          userEvent.keyboard('{ArrowRight}')
          expect(firstItem).toBeVisible()
          expect(firstItem).toHaveFocus()

          userEvent.keyboard('{ArrowLeft}')
          expect(firstItem).not.toBeVisible()
          expect(nestedMenu).toHaveFocus()
        })
      })
    })
    describe('Sibling tests', () => {
      it('should move focus to the next item of the menubar when pressing Right Arrow if not on submenu label', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <Menu label="Menu 1">
              <button type="button">Link 1</button>
            </Menu>
            <Menu label="Menu 2">
              <button type="button">Link 2</button>
            </Menu>
          </Dropdown>,
        )
        const menu1 = screen.getByText('Menu 1')
        const menu2 = screen.getByText('Menu 2')
        const firstItem = screen.getByText('Link 1')
        openSubmenu(menu1, firstItem)

        userEvent.keyboard('{ArrowRight}')
        expect(menu2).toHaveFocus()
      })
      it('should still display the first level of submenu when moving to sibling from submenu', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <Menu label="Menu 1">
              <button type="button">Link 1</button>
            </Menu>
            <Menu label="Menu 2">
              <button type="button">Link 2</button>
            </Menu>
          </Dropdown>,
        )
        const menu1 = screen.getByText('Menu 1')
        const menu2 = screen.getByText('Menu 2')
        const firstItem = screen.getByText('Link 1')
        const submenu2 = screen.getByText('Link 2')
        openSubmenu(menu1, firstItem)

        userEvent.keyboard('{ArrowRight}')
        expect(menu2).toHaveFocus()
        expect(submenu2).toBeVisible()
      })
      it('should close the submenu preview when pressing Escape while focus is in the menubar', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <Menu label="Menu 1">
              <button type="button">Link 1</button>
            </Menu>
            <Menu label="Menu 2">
              <button type="button">Link 2</button>
            </Menu>
          </Dropdown>,
        )
        const menu1 = screen.getByText('Menu 1')
        const menu2 = screen.getByText('Menu 2')
        const firstItem = screen.getByText('Link 1')
        const submenu2 = screen.getByText('Link 2')
        openSubmenu(menu1, firstItem)

        userEvent.keyboard('{ArrowRight}')
        expect(menu2).toHaveFocus()
        expect(submenu2).toBeVisible()

        userEvent.keyboard('{Escape}')
        expect(menu2).toHaveFocus()
        expect(submenu2).not.toBeVisible()
      })
      it('should move focus to the previous item of the menubar when pressing Left Arrow if not in submenu\'s submenu', () => {
        renderWithStyle(
          <Dropdown aria-label="My Menu">
            <Menu label="Menu 1">
              <button type="button">Link 1</button>
            </Menu>
            <Menu label="Menu 2">
              <button type="button">Link 2</button>
            </Menu>
          </Dropdown>,
        )
        const menu1 = screen.getByText('Menu 1')
        const menu2 = screen.getByText('Menu 2')
        menu1.focus()
        userEvent.keyboard('{ArrowRight}')
        openSubmenu(menu2)

        userEvent.keyboard('{ArrowLeft}')
        expect(menu1).toHaveFocus()
      })
    })
    it('should return focus to the last focussed item of the menubar when tabbing back', () => {
      render(
        <Dropdown aria-label="My Menu">
          <button type="button">Link 1</button>
          <button type="button">Link 2</button>
        </Dropdown>,
      )
      const firstLink = screen.getByText('Link 1')
      const secondLink = screen.getByText('Link 2')
      firstLink.focus()
      expect(firstLink).toHaveFocus()
      userEvent.keyboard('{ArrowLeft}')
      expect(secondLink).toHaveFocus()
      userEvent.tab()
      expect(secondLink).not.toHaveFocus()
      userEvent.tab({ shift: true })
      expect(secondLink).toHaveFocus()
    })
  })

  describe('a11y tests', () => {
    it('should set a role of menubar on the main menu', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <button type="button">Link</button>
        </Dropdown>,
      )
      const menubar = screen.getByRole('menubar')
      expect(menubar).toBeInTheDocument()
    })
    it('should set a role of menuitem on the items', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <button type="button">Link</button>
        </Dropdown>,
      )
      const item = screen.getByText('Link')
      expect(item).toHaveAttribute('role', 'menuitem')
    })
    it('should remove the role of listitem from the items', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <button type="button">Link</button>
        </Dropdown>,
      )
      const items = screen.queryAllByRole('listitem')
      expect(items).toHaveLength(0)
    })
    it('should set a role of menu on the submenus', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <Menu label="Menu">
            <button type="button">Link</button>
          </Menu>
        </Dropdown>,
      )
      const label = screen.getByText('Menu')
      userEvent.hover(label)
      const menu = screen.getByRole('menu')
      expect(menu).toBeInTheDocument()
    })
    it('should set a role of menuitem on the items of the submenus', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <Menu label="Menu">
            <button type="button">Link</button>
          </Menu>
        </Dropdown>,
      )
      const label = screen.getByText('Menu')
      userEvent.hover(label)
      const item = screen.getByText('Link')
      expect(item).toHaveAttribute('role', 'menuitem')
    })
    it('should set the tabindex to 0 only on the current top level item', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <button type="button">Active Link</button>
          <button type="button">Link</button>
        </Dropdown>,
      )
      const activeLink = screen.getByText('Active Link')
      const otherLink = screen.getByText('Link')
      expect(activeLink).toHaveAttribute('tabIndex', '0')
      expect(otherLink).toHaveAttribute('tabIndex', '-1')
    })
    it('should keep the tabindex to -1 when focussing an item in a submenu', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <Menu label="Menu">
            <button type="button">Link</button>
          </Menu>
        </Dropdown>,
      )
      const label = screen.getByText('Menu')
      const item = screen.getByText('Link')
      openSubmenu(label, item)
      expect(label).toHaveAttribute('tabIndex', '0')
      expect(item).toHaveAttribute('tabIndex', '-1')
    })
    it('should set an aria-label on the menubar', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <button type="button">Link</button>
        </Dropdown>,
      )
      const menubar = screen.getByRole('menubar')
      expect(menubar).toHaveAttribute('aria-label', 'My Menu')
    })
    it('should set an aria-haspopup of menu on the labels for submenus', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <Menu label="Menu">
            <button type="button">Link</button>
          </Menu>
        </Dropdown>,
      )
      const label = screen.getByText('Menu')
      // aria-haspopup="true" defaults to menu
      // This will also match aria-haspopup={true} (as a boolean)
      // because it is converted to string on render
      expect(label).toHaveAttribute('aria-haspopup', expect.stringMatching(/menu|true/))
    })
    it('should set aria-expanded to false on submenu when closed', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <Menu label="Menu">
            <button type="button">Link</button>
          </Menu>
        </Dropdown>,
      )
      const label = screen.getByText('Menu')
      expect(label).toHaveAttribute('aria-expanded', 'false')
    })
    it('should set aria-expanded to true on submenu when open', () => {
      renderWithStyle(
        <Dropdown aria-label="My Menu">
          <Menu label="Menu">
            <button type="button">Link</button>
          </Menu>
        </Dropdown>,
      )
      const label = screen.getByText('Menu')
      openSubmenu(label)
      expect(label).toHaveAttribute('aria-expanded', 'true')
    })
  })
})
