import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import { Link } from "react-router-dom";

function PageFooter() {
  return (
    <Footer container className="shadow bg-primary-200">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <FooterBrand
            href="/"
            src="/emplogo.png"
            alt="Every Mini Painted Logo"
            name="Every Mini Painted"
          />
          <FooterLinkGroup>
            <FooterLink as={Link} to="/about">
              About
            </FooterLink>
            {/* <FooterLink as={Link} to="/privacy">Privacy Policy</FooterLink> */}
            <FooterLink as={Link} to="/contact">
              Contact
            </FooterLink>
          </FooterLinkGroup>
        </div>
        <FooterDivider />
        <FooterCopyright by="Evan Parker" year={new Date().getFullYear()} />
      </div>
    </Footer>
  );
}

export default PageFooter;
