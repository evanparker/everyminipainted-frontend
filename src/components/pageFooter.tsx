import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

function PageFooter() {
  const navigate = useNavigate();
  return (
    <Footer container className="shadow bg-primary-200">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <FooterBrand
            onClick={() => navigate("/")}
            src="/emplogo.png"
            alt="Every Mini Painted Logo"
            name="Every Mini Painted"
          />
          <FooterLinkGroup>
            <FooterLink
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
              href={"/about"}
            >
              About
            </FooterLink>
            {/* <FooterLink href="/rules">Rules</FooterLink> */}
            {/* <FooterLink href="/privacy">Privacy Policy</FooterLink> */}
            <FooterLink
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
              }}
              href={"/contact"}
            >
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
