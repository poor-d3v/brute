from setuptools import setup, find_packages

setup(
    name="brute",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "flask>=3.0.2",
        "flask-cors>=4.0.0",
        "xrpl-py>=2.5.0",
        "python-dotenv>=1.0.1",
    ],
    extras_require={
        "dev": [
            "pytest>=8.0.2",
            "black>=24.2.0",
            "mypy>=1.8.0",
            "types-flask>=1.1.6",
            "types-flask-cors>=4.0.0.3",
        ]
    },
    python_requires=">=3.8",
    author="BRUTE Team",
    author_email="your.email@example.com",
    description="XRPL Seed Recovery Tool",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/brute",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
) 