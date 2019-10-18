import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { LocalizedLink, localize } from '../localization'
import Button from '../form/button'
import Container from '../containers/container'
import Modal, { useModal } from '../elements/modal'
import SignupModal from '../elements/signup-modal'
import OffCanvasMenu, { moveOffCanvasMenu } from '../elements/off-canvas-menu'
import PlatformsDropdown from '../elements/platforms-dropdown'
import { SharedLinkStyle } from '../localization/localized-link'
import Login from 'common/login'
import device from 'themes/device'
// Icons
import LogoBeta from 'images/svg/logo-beta.svg'
import Hamburger from 'images/svg/hamburger_menu.svg'
const NavWrapper = styled.div`
    width: 100%;
    position: fixed;
    z-index: 100;
`
const LogoLink = styled(LocalizedLink)`
    text-decoration: none;
`
const StyledNav = styled.nav`
    background-color: var(--color-black);
    height: 7.2rem;
    width: 100%;
    position: relative;
    @media ${device.tabletL} {
        height: auto;
    }
`
const Wrapper = styled(Container)`
    font-size: var(--text-size-s);
    padding: 1.2rem 0;
    justify-content: space-between;
    height: 7.2rem;
`
const NavLeft = styled.div`
    text-align: left;
    @media ${device.tabletL} {
        svg {
            width: 50%;
        }
    }
`
const NavCenter = styled.ul`
    text-align: center;
    padding: 0;
    display: flex;
    justify-content: space-between;
    @media ${device.tabletL} {
        display: none;
    }
`
const NavRight = styled.div`
    display: inline-flex;
    text-align: right;
    overflow: hidden;
    padding: 0;
    justify-content: center;
    transition: all 0.2s;
    @media ${device.tabletL} {
        display: none;
    }
`
const NavLink = styled.li`
    list-style-type: none;
    display: inline-block;
    text-align: left;
    ${props => {
        if (props.margin) return 'margin: 0 4rem;'
    }}
`
const StyledLink = styled(LocalizedLink)`
    ${SharedLinkStyle}
`
const StyledButton = styled.a`
    ${SharedLinkStyle}
    cursor: pointer;
    user-select: none;
`

const SignupButton = styled(Button)`
    margin-left: 1.6rem;
    margin-right: ${props => {
        if (props.move) {
            return 0
        } else {
            if (props.width.current) {
                const calculation = props.width.current.offsetWidth / 10
                return `-${calculation}rem`
            }
            return 0
        }
    }};
`

const HamburgerMenu = styled(Hamburger)`
    cursor: pointer;
    display: none;
    @media ${device.tabletL} {
        display: block;
        cursor: pointer;
    }
`
const handleScroll = (show, hide) => {
    const show_height = 400
    window.scrollY > show_height ? show() : hide()
}

const Nav = () => {
    const nav_ref = useRef(null)
    const button_ref = useRef(null)
    const [is_platforms_open, setIsPlatformsOpen] = useState(false)
    const [has_animation, setHasAnimation] = useState(false)
    const [show_modal, toggleModal, closeModal] = useModal()
    const [show_button, showButton, hideButton] = moveButton()
    const buttonHandleScroll = () => handleScroll(showButton, hideButton)
    const [
        is_canvas_menu_open,
        openOffCanvasMenu,
        closeOffCanvasMenu,
    ] = moveOffCanvasMenu()
    useEffect(() => {
        document.addEventListener('scroll', buttonHandleScroll, {
            passive: true,
        })
        const handleClickOutside = e => {
            if (!nav_ref.current.contains(e.target)) {
                setIsPlatformsOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('scroll', buttonHandleScroll)
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])
    const handleLogin = () => {
        Login.redirectToLogin()
    }
    const handleMenuClick = () => {
        is_canvas_menu_open ? closeOffCanvasMenu() : openOffCanvasMenu()
    }
    const handlePlatformsClick = () => {
        setIsPlatformsOpen(!is_platforms_open)
        setHasAnimation(true)
    }
    const handleNormalLink = () => {
        setHasAnimation(false)
    }
    return (
        <NavWrapper ref={nav_ref}>
            <StyledNav>
                <PlatformsDropdown
                    is_open={is_platforms_open}
                    has_animation={has_animation}
                />
                <Wrapper>
                    <NavLeft>
                        <LogoLink to="/" aria-label={localize('Home')}>
                            <LogoBeta />
                        </LogoLink>
                    </NavLeft>
                    <NavCenter>
                        <NavLink onClick={handlePlatformsClick}>
                            <StyledButton
                                aria-label={localize('Trade')}
                                activeClassName="active"
                            >
                                {localize('Trade')}
                            </StyledButton>
                        </NavLink>
                        <NavLink onClick={handleNormalLink} margin>
                            <StyledLink
                                activeClassName="active"
                                to="/about/"
                                aria-label={localize('About us')}
                                partiallyActive={true}
                            >
                                {localize('About us')}
                            </StyledLink>
                        </NavLink>
                        <NavLink>
                            <StyledLink
                                activeClassName="active"
                                to="/help-centre/"
                                aria-label={localize('Help Centre')}
                                partiallyActive={true}
                            >
                                {localize('Help Centre')}
                            </StyledLink>
                        </NavLink>
                    </NavCenter>
                    <NavRight>
                        <Button onClick={handleLogin} primary>
                            <span>{localize('Log in')}</span>
                        </Button>
                        <SignupButton
                            secondary
                            onClick={toggleModal}
                            move={show_button}
                            ref={button_ref}
                            width={button_ref}
                        >
                            <span>{localize('Try for free')}</span>
                        </SignupButton>
                    </NavRight>
                    <HamburgerMenu onClick={handleMenuClick} />
                    <OffCanvasMenu
                        is_canvas_menu_open={is_canvas_menu_open}
                        closeOffCanvasMenu={closeOffCanvasMenu}
                    />
                </Wrapper>
                <Modal
                    toggle={toggleModal}
                    is_open={show_modal}
                    closeModal={closeModal}
                >
                    <SignupModal autofocus />
                </Modal>
            </StyledNav>
        </NavWrapper>
    )
}
export default Nav

function moveButton(is_visible = false) {
    const [show_button, setShowButton] = useState(is_visible)
    const showButton = () => setShowButton(!show_button)
    const hideButton = () => setShowButton(false)
    return [show_button, showButton, hideButton]
}
